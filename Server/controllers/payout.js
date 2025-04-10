import Payout from "../models/Payout.js";
import User from "../models/User.js";
import { postTransaction } from "./transaction.js";
import { createNotification } from "./notification.js";
import { initializePayout } from "./paystack.js";

export const getAllPayout = async (_req, res) => {
  const payouts = await Payout.find().sort({ createdAt: -1 }).lean();
  if (!payouts?.length) return res.status(400).json({ message: "No payout found" });
  res.json(payouts);
};

export const getUserPayouts = async (req, res) => {
  const { userId } = req.params;
  const payout = await Payout.find({ user: userId }).sort({ createdAt: -1 }).lean();

  if (!payout) return res.status(400).json({ message: "No payout found" });
  res.json(payout);
};

export const getPayout = async (req, res) => {
  const { payoutId } = req.params;
  const payout = await Payout.findById(payoutId).lean();
  if (!payout) return res.status(400).json({ message: "No payout found" });
  res.json(payout);
};

export const postPayout = async (req, res) => {
  const { userId, amount } = req.body;
  if (!amount) return res.status(400).json({ message: "Amount field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  try {
    if (currentUser.affiliate.balance < parseInt(amount))
      return res.status(400).json({ message: "Insufficient fund!" });

    // Ensure payout can only be requested after or on the due date
    const today = new Date();
    const dueDate = currentUser.affiliate.dueDate;
    if (today < dueDate)
      return res
        .status(400)
        .json({ message: `Payouts can only be requested on your due date: ${dueDate.toLocaleDateString()}` });

    let updatedRequest = {
      userId,
      product: "Withdrawal",
      transactionType: "Affiliate Payout",
      amount: parseInt(amount),
      reference: "Payout",
    };

    await postTransaction({ body: updatedRequest }, res);

    const payout = await Payout.create({
      user: userId,
      username: currentUser.username,
      email: currentUser.email,
      role: currentUser.role,
      amount: parseInt(amount),
      bankDetails: currentUser.bankDetails,
    });

    if (payout) {
      await createNotification({
        id: userId,
        title: "Affiliate Payout",
        text: "We are currently processing your",
        product: `affiliate payout request of ₦${amount}`,
      });

      return res.status(200).json({ message: `You withdrawal is being processed. You'll be notified shortly.` });
    } else return res.status(400).json({ message: "Invalid payout data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePayout = async (req, res) => {
  const { userId, payoutId, status, amount } = req.body;

  // Validate inputs
  if (!payoutId) return res.status(400).json({ message: "ID field is required" });
  if (!userId) return res.status(400).json({ message: "User field is required" });

  // Find payout by ID
  const payout = await Payout.findById(payoutId).exec();
  if (!payout) return res.status(400).json({ message: "Payout not found!" });

  // Check if the payout has already been approved or rejected
  if (payout.status === "Approved" || payout.status === "Rejected") {
    return res.status(400).json({ message: `You've already ${payout.status} this transaction` });
  }

  // Find the current user by ID
  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "Current user not found" });

  // Check if the user has sufficient funds
  if (currentUser.affiliate.balance < amount) {
    return res.status(400).json({ message: "Insufficient funds" });
  }

  // Update balance and payout status if approved
  if (status === "Approved") {
    currentUser.affiliate.balance -= amount;
    currentUser.affiliate.withdrawalCount += amount;
  }

  if (status) {
    payout.status = status;
  }

  // Create notifications based on the payout status
  if (status === "Approved") {
    const payutStatus = await initializePayout(amount, currentUser.bankDetails.recipientCode);

    if (payutStatus.status)
      await createNotification({
        id: userId,
        title: "Affiliate Payout",
        text: "We have successfully confirmed your",
        product: `affiliate payout request of ₦${amount}`,
      });
  } else if (status === "Rejected") {
    await createNotification({
      id: userId,
      title: "Affiliate Payout",
      text: "Your",
      product: `affiliate payout request of ₦${amount} was rejected`,
    });
  }

  // Save the updated payout and user
  await payout.save();
  await currentUser.save();

  // Send success response
  res.status(200).json("Payout has been successfully updated");
};

export const deletePayout = async (req, res) => {
  const { payoutId } = req.params;
  if (!payoutId) return res.status(400).json({ message: "Payout ID required" });

  const payout = await Payout.findById(payoutId).exec();
  if (!payout) return res.status(400).json({ message: "Payout not found!" });

  await payout.deleteOne();
  res.json("Payout successfully deleted");
};
