import BookSession from "../models/BookSession.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { createNotification } from "./notification.js";

export const getAllBookSession = async (_req, res) => {
  try {
    const bookSessions = await BookSession.find().sort({ createdAt: -1 }).lean();
    if (!bookSessions?.length) return res.status(200).json([]);

    const now = new Date();

    // Add status and spread bookSession properties into the top-level object
    const sessionsWithStatus = bookSessions.map(({ bookSession, ...rest }) => ({
      ...rest,
      ...bookSession, // Spread bookSession properties here
      sessionStatus: bookSession.date && new Date(bookSession.date) < now ? "Past" : "Upcoming",
    }));

    res.json(sessionsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookSession = async (req, res) => {
  const { bookSessionId } = req.params;
  const bookSession = await BookSession.findById(bookSessionId).lean();
  if (!bookSession) return res.status(400).json({ message: "No bookSession found" });
  res.json(bookSession);
};

export const postBookSession = async (req, res) => {
  const { userId, program, bookSession } = req.body;

  if (!program) return res.status(400).json({ message: "Program field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  try {
    const bookSessionData = await BookSession.create({
      user: userId,
      program,
      bookSession,
    });

    if (bookSessionData) return res.status(200).json({ message: `Session has been booked successfully` });
    else return res.status(400).json({ message: "Invalid data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBookSession = async (req, res) => {
  const { userId, bookSessionId, status, amount } = req.body;

  if (!bookSessionId) return res.status(400).json({ message: "ID field is required" });
  if (!userId) return res.status(400).json({ message: "User field is required" });

  const bookSession = await BookSession.findById(bookSessionId).exec();
  if (!bookSession) return res.status(400).json({ message: "Book Session not found!" });

  if (bookSession.status === "Successful" || bookSession.status === "Failed")
    return res.status(400).json({ message: `You've already ${bookSession.status} this transaction` });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "Current user not found" });

  const transaction = await Transaction.findById(bookSession.transactionId).exec();
  if (!transaction) return res.status(400).json({ message: "Transaction not found" });

  if (status) {
    bookSession.status = status;
    transaction.status = status;
  }

  // Create notifications based on the payout status
  if (status === "Successful") {
    await createNotification({
      id: userId,
      title: "Book Session",
      text: "You have successfully purchased",
      product: bookSession.program,
    });
  } else if (status === "Failed") {
    await createNotification({
      id: userId,
      title: "Book Session",
      text: "Your transaction to purchase",
      product: `${bookSession.program} was unsuccessful`,
    });
  }

  // Save the updated payout and user
  await bookSession.save();
  await transaction.save();
  await currentUser.save();

  // Send success response
  res.status(200).json("Booked Session has been successfully updated");
};

export const deleteBookSession = async (req, res) => {
  const { bookSessionId } = req.params;
  if (!bookSessionId) return res.status(400).json({ message: "BookSession ID required" });

  const bookSession = await BookSession.findById(bookSessionId).exec();
  if (!bookSession) return res.status(400).json({ message: "BookSession not found!" });

  await bookSession.deleteOne();
  res.json({ message: "BookSession successfully deleted" });
};
