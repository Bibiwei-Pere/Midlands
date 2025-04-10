import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Course from "../models/Course.js";
import { createNotification } from "./notification.js";
import BookSession from "../models/BookSession.js";

export const getUserTransaction = async () => {
  const user = "6740a2ee1ebdeb90d4292de7";

  try {
    const transaction = await Transaction.find({ user }).lean();
    if (!transaction) return console.log("Transaction not found");

    console.log(transaction);
  } catch (error) {
    console.log(error);
  }
};

export const getPatchTransaction = async (req, res) => {
  const data = {
    transactionId: "6740d2bdfbbeb907f21435d7",
    completed: true,
    status: "Successful",
    reference: "ref_wt1t5ym5bfb",
    product: "Smart Trader pack",
    transactionType: "Paystack",
    amount: 64950,
    duration: 90,
    courseId: "672a7ecf131c8c4834606d02",
    instructorId: "67025086901bb2be071ad38b",
    notificationTitle: "New Course",
    notificationDesc: "You have successfully purchased",
  };

  await updateTransaction({ body: data }, res);
};

export const getAllTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).lean();
    if (!transactions?.length) return res.status(400).json({ message: "No transaction found" });

    const transactionWithUser = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await User.findById(transaction.user).lean().exec();
        return {
          ...transaction,
          ...user,
          activeCourses: user && user.activeCourseList ? user.activeCourseList.length : 0,
        };
      })
    );

    res.json(transactionWithUser);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCourseTransaction = async (_req, res) => {
  try {
    const users = await User.find().lean();
    if (!users?.length) return console.log("No users found");

    const usersWithActiveCourses = users.filter((user) => user.activeCourses > 0);

    // Store all the results
    const allActiveTransactionsWithCourses = [];

    for (const user of usersWithActiveCourses) {
      const transactions = await Transaction.find({ user: user._id }).exec();

      const activeTransactions = transactions.filter((transaction) => transaction.active === true);

      // If there are active transactions, map them to include course data
      if (activeTransactions.length > 0) {
        const activeTransactionsWithCourses = await Promise.all(
          activeTransactions.map(async (transaction) => {
            const course = await Course.findById(transaction.reference).exec();
            return {
              ...transaction.toObject(), // convert transaction to plain JS object
              course, // include course data
            };
          })
        );

        allActiveTransactionsWithCourses.push(...activeTransactionsWithCourses);
      }
    }

    return res.status(200).json(allActiveTransactionsWithCourses);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

export const getCourseTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId).lean();
    if (!transaction) return console.log("Transaction not found");

    const course = await Course.findById(transaction.reference).exec();
    return res.status(200).json(...transaction.toObject(), course);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error" });
  }
};

export const postTransaction = async (req, res) => {
  console.log(req.body);
  const {
    userId,
    courseId,
    product,
    transactionType,
    amount,
    reference,
    duration,
    bookSession,
    paymentMethod,
    notificationDesc,
    notificationTitle,
  } = req.body;
  if (!userId) return res.status(400).json({ message: "User field is required" });
  if (!product) return res.status(400).json({ message: "Product field is required" });
  if (!transactionType) return res.status(400).json({ message: "TransactionType field is required" });
  if (!amount) return res.status(400).json({ message: "Amount field is required" });
  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  // Check if the user is trying to purchase a course that they already own
  if (courseId && duration) {
    if (currentUser.activeCourseList.length) {
      // Extract courseIds from user's activeCourses
      const activeCourseIds = currentUser.activeCourseList.map((course) => course.courseId);
      // Check if the current product is already in the user's active course list
      if (activeCourseIds.includes(courseId)) {
        // Assuming product is the course ID
        return res.status(400).json({ message: "You have already purchased this course" });
      }
    }
  }

  if (bookSession) {
    if (currentUser.bookSession.length > 0) {
      const activeBookSessions = currentUser.bookSession.map((session) => session.program);
      console.log("Active Session IDs:", activeBookSessions);
      if (activeBookSessions.includes(product))
        return res.status(400).json({ message: "You have already booked this session" });
    }
  }

  // Create the transaction object based on whether `courseId` is provided
  let updatedTransaction = {};
  if (courseId && duration) {
    updatedTransaction = {
      user: userId,
      product,
      transactionType,
      amount: parseInt(amount),
      reference,
      courseId,
      duration,
    };
  } else if (bookSession) {
    updatedTransaction = {
      user: userId,
      product,
      transactionType,
      amount: parseInt(amount),
      reference,
      bookSession,
    };
    if (paymentMethod === "USD Transfer" || paymentMethod === "Cryprocurrency")
      if (notificationTitle && notificationDesc) {
        await createNotification({
          id: currentUser._id.valueOf(),
          title: notificationTitle,
          text: notificationDesc,
          product: product,
        });

        const adminUsers = await User.find({ role: "Admin" }).exec();
        // Send notifications to all admins
        for (const admin of adminUsers) {
          await createNotification({
            id: admin._id.valueOf(),
            // id: admin._id.valueOf(),
            title: notificationTitle,
            text: `${bookSession.name} just made payment for`,
            product: `${product} via ${paymentMethod}, Confirm`,
          });
        }
      }
  } else {
    updatedTransaction = {
      user: userId,
      product,
      transactionType,
      amount: parseInt(amount),
      reference,
    };
  }

  // Create a new transaction
  const transaction = await Transaction.create(updatedTransaction);

  if (transaction) {
    let bookSessionId;

    if (bookSession) {
      const bookId = await BookSession.create({
        user: userId,
        program: product,
        bookSession,
        transactionId: transaction._id,
        paymentMethod,
      });
      bookSessionId = bookId._id;
    }

    await transaction.save();
    return res.status(200).json({ transactionId: transaction._id, bookSessionId });
  } else {
    return res.status(400).json({ message: "Invalid transaction received" });
  }
};

export const updateTransaction = async (req, res) => {
  console.log("Update", req.body);

  const {
    transactionId,
    completed,
    status,
    courseId,
    instructorId,
    product,
    duration,
    notificationTitle,
    notificationDesc,
    transactionType,
    bookSessionId,
  } = req.body;
  if (!transactionId) return res.status(400).json({ message: "transactionId field is required" });
  if (typeof completed !== "boolean") return res.status(400).json({ message: "Completed field must be true or false" });

  const transaction = await Transaction.findById(transactionId).exec();
  if (!transaction) return res.status(400).json({ message: "Transaction not found" });

  const currentUser = await User.findById(transaction.user).exec();
  if (!currentUser) return res.status(400).json({ message: "User not found" });

  try {
    // Only handle course-related transactions (not withdrawals)
    if (courseId && duration) {
      console.log("first");
      const course = await Course.findById(courseId).exec();
      if (!course) return res.status(400).json({ message: "Course not found" });

      // Extract the chapters and set the first one to completed: true, others to false
      const courseChapters = course.chapters.map((chapter, index) => ({
        chapterId: chapter._id,
        completed: index === 0 ? true : false,
      }));

      if (course.category === "3in1") {
        console.log("Updateoooooo");
        console.log("Updateoooooo", course.selectedCourseIds);

        for (const selectedCourseId of course.selectedCourseIds) {
          const selectedCourse = await Course.findById(selectedCourseId).exec();
          if (!selectedCourse) continue; // Skip if course not found

          const selectedCourseChapters = selectedCourse.chapters.map((chapter, index) => ({
            chapterId: chapter._id,
            completed: index === 0 ? true : false,
          }));

          currentUser.activeCourseList.push({
            courseId: selectedCourseId,
            duration: duration,
            commission: selectedCourse.commission,
            chapters: selectedCourseChapters,
          });
        }
      } else
        currentUser.activeCourseList.push({
          courseId: courseId,
          duration: duration,
          commision: course.commision,
          chapters: courseChapters,
        });

      console.log("second");

      if (currentUser.affiliate?.referee?.userId) {
        const referee = await User.findById(currentUser.affiliate.referee.userId).exec();
        if (referee) {
          referee.affiliate.commissionRate += course.commission;
          referee.affiliate.conversion += 1;
          referee.affiliate.balance += (course.commission / 100) * course.price;
          referee.affiliate.lifetimeEarnings += (course.commission / 100) * course.price;
          console.log(referee.affiliate);
          await referee.save();
        }
      }
      console.log("third");

      const instructor = await User.findById(course?.user).exec();
      if (!instructor) return res.status(400).json({ message: "Instructor not found" });

      instructor.students += 1;
      instructor.courses += 1;

      await instructor.save();
      console.log("fourth");
    }

    if (transactionType === "Book Session") {
      const booked = await BookSession.findById(bookSessionId).exec();
      if (!booked) return res.status(400).json({ message: "BookId not found" });

      if (status === "Successful")
        currentUser.bookSession.push({
          bookId: booked._id,
          program: product,
        });

      booked.status = status;
      await booked.save();
    }

    if (notificationTitle && notificationDesc)
      await createNotification({
        id: currentUser._id.valueOf(),
        title: notificationTitle,
        text: notificationDesc,
        product: product,
      });

    transaction.completed = completed;
    transaction.status = status;
    // Save both the user and the transaction updates
    console.log(transaction);
    await currentUser.save();
    await transaction.save();

    res.status(200).json({ message: "Transaction successfully updated" });
  } catch (error) {
    console.log("This is the error", error);
  }
};

export const deleteTransaction = async (req, res) => {
  const { transactionId: id } = req.body;

  if (!id) {
    const result = await Transaction.deleteMany({});
    console.log(result);
    if (result.deletedCount > 0) res.json(`All transactions deleted`);
    else res.status(400).json({ message: "No transaction found to delete" });
  } else {
    const transactions = await Transaction.findById(id).exec();
    if (!transactions) return res.status(400).json({ message: "Transaction not found" });
    await transactions.deleteOne();
    res.json(`Transaction deleted successfuly`);
  }
};
