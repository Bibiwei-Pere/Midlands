import Paystack from "paystack-node";
import https from "https";
import { updateTransaction } from "./transaction.js";

const { LIVE_PAYSTACK_SECRET_KEY, LIVE_PAYSTACK_PUBLIC_SECRET_KEY, NODE_ENV } = process.env;
const paystack = new Paystack(LIVE_PAYSTACK_PUBLIC_SECRET_KEY, NODE_ENV);

export const getBanks = async (_req, res) => {
  try {
    const allBanks = await banks();
    return res.json(allBanks);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch banks data" });
  }
};

export const verifyAccountNumber = async (req, res) => {
  const { account_number, bank_code } = req.params;
  try {
    const accountDetails = await accountNumber(account_number, bank_code);
    const recipient_code = await transferRecepient(account_number, bank_code, accountDetails.account_name);

    console.log(recipient_code);
    return res.json({ ...accountDetails, recipient_code });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch banks data" });
  }
};

const accountNumber = async (account_number, bank_code) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.status) {
            console.log("API response data:", response.data);
            resolve(response.data); // Resolve with bank data
          } else {
            console.error("API response status failed:", response);
            reject(new Error("Failed to retrieve bank data from API"));
          }
        } catch (parsingError) {
          console.error("Error parsing JSON:", parsingError);
          reject(new Error("Error parsing bank data response"));
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(error);
    });

    req.end(); // Close the request
  });
};

const banks = async () => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/bank",
    method: "GET",
    headers: {
      Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          if (response.status) {
            console.log("API response data:", response.data);
            resolve(response.data); // Resolve with bank data
          } else {
            console.error("API response status failed:", response);
            reject(new Error("Failed to retrieve bank data from API"));
          }
        } catch (parsingError) {
          console.error("Error parsing JSON:", parsingError);
          reject(new Error("Error parsing bank data response"));
        }
      });
    });

    req.on("error", (error) => {
      console.error("Request error:", error);
      reject(error);
    });

    req.end(); // Close the request
  });
};
// Function to initialize payment with the split configuration
const initializePayment = async (email, amount, split_code) => {
  const params = JSON.stringify({
    email,
    amount: amount * 100,
    split_code,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("Payment initialized:", response);
        if (response.status) {
          resolve(response.data);
        } else {
          reject(new Error("Failed to initialize payment"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
};

export const initializePayout = async (amount, recipient) => {
  const reference = generateReference(); // Generate unique reference

  const params = JSON.stringify({
    source: "balance",
    amount: amount * 100,
    reference,
    recipient,
    reason: "Affiliate Payout",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transfer",
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("Payment initialized:", response);
        if (response.status) {
          resolve(response.data);
        } else {
          reject(new Error("Failed to initialize payment"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
};

// Main function to handle transaction verification, subaccount creation, and payment initialization
export const postVerify = async (req, res) => {
  const {
    transactionId,
    reference,
    product,
    transactionType,
    courseId,
    instructorId,
    duration,
    notificationTitle,
    notificationDesc,
    bookSessionId,
    amount,
    email,
  } = req.body;

  console.log("Paystack", req.body);

  try {
    await paystack.verifyTransaction({ reference: reference });

    let updatedRequest = {};
    if (courseId && duration) {
      updatedRequest = {
        transactionId,
        completed: true,
        status: "Successful",
        reference,
        product,
        duration,
        instructorId,
        courseId,
        transactionType,
        notificationTitle,
        notificationDesc,
      };

      // Create subaccounts for 50-50 split payment
      // const subaccount1 = await createSubAccount("CANDLEKAPITAL GLOBAL SERVICES LIMITED", "221", "0063472593", 50);
      // const subaccount2 = await createSubAccount("OBIONE GLOBAL CONCEPT", "058", "0252379045", 50);

      // Create split with the two subaccounts
      // const split_code = await createSplit("Regular Course Split Web", subaccount1, 50, subaccount2, 50);
      const split_code = "SPL_eberKmFnzy"; // Live
      // const split_code = "SPL_iYXy9vcrP2"; // Test

      // Initialize payment with split ID
      const paymentData = await initializePayment(email, amount, split_code);
      console.log("Payment initialized:", paymentData);
      await updateTransaction({ body: updatedRequest }, res);
    } else {
      updatedRequest = {
        transactionId,
        completed: true,
        status: "Successful",
        reference,
        product,
        transactionType,
        notificationTitle,
        notificationDesc,
        bookSessionId,
      };

      // const subaccount1 = await createSubAccount("CANDLEKAPITAL GLOBAL SERVICES LIMITED", "221", "0063472593", 90);
      // const subaccount2 = await createSubAccount("OBIONE GLOBAL CONCEPT", "058", "0252379045", 10);

      // const split_code = await createSplit("Private Mentorship Split", subaccount1, 90, subaccount2, 10);
      const split_code = "SPL_9g6WDeZyzD"; // Live
      // const split_code = "SPL_HExAd61nj9"; // Test

      await initializePayment(email, amount, split_code);
      await updateTransaction({ body: updatedRequest }, res);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

const transferRecepient = async (account_number, bank_code, account_name) => {
  const params = JSON.stringify({
    type: "nuban",
    name: account_name,
    account_number: account_number,
    bank_code: bank_code,
    currency: "NGN",
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transferrecipient",
    method: "POST",
    headers: {
      Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("Subaccount created:", response);
        if (response.status) {
          resolve(response.data.recipient_code);
        } else {
          reject(new Error("Failed to create subaccount"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(params);
    req.end();
  });
};

const generateReference = () => {
  const prefix = "ref-mywebsite-";
  const randomString = Math.random().toString(36).substring(2, 17); // Generates 15 random alphanumeric characters
  return `${prefix}${randomString}`;
};
// // Function to create a subaccount
// const createSubAccount = async (business_name, bank_code, account_number, percentage_charge) => {
//   const params = JSON.stringify({
//     business_name,
//     bank_code,
//     account_number,
//     percentage_charge,
//   });

//   const options = {
//     hostname: "api.paystack.co",
//     port: 443,
//     path: "/subaccount",
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     },
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", () => {
//         const response = JSON.parse(data);
//         console.log("Subaccount created:", response);
//         if (response.status) {
//           resolve(response.data.subaccount_code);
//         } else {
//           reject(new Error("Failed to create subaccount"));
//         }
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     req.write(params);
//     req.end();
//   });
// };

// // Function to create a split configuration
// const createSplit = async (name, subaccount1, share1, subaccount2, share2) => {
//   const params = JSON.stringify({
//     name,
//     type: "percentage",
//     currency: "NGN",
//     subaccounts: [
//       { subaccount: subaccount1, share: share1 },
//       { subaccount: subaccount2, share: share2 },
//     ],
//   });

//   const options = {
//     hostname: "api.paystack.co",
//     port: 443,
//     path: "/split",
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${LIVE_PAYSTACK_SECRET_KEY}`,
//       "Content-Type": "application/json",
//     },
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", () => {
//         const response = JSON.parse(data);
//         console.log("Split created:", response);
//         if (response.status) {
//           resolve(response.data.split_code);
//         } else {
//           reject(new Error("Failed to create split"));
//         }
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     req.write(params);
//     req.end();
//   });
// };
