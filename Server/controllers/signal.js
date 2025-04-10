import User from "../models/User.js";
import Signal from "../models/Signal.js";

export const getAllSignals = async (_req, res) => {
  const signal = await Signal.find().sort({ createdAt: -1 }).lean();

  if (!signal?.length) return res.status(200).json([]);

  const signalWithUser = await Promise.all(
    signal.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(signalWithUser);
};

export const getUserSignals = async (req, res) => {
  const { userId } = req.params;

  const signal = await Signal.find({ user: userId }).sort({ createdAt: -1 }).lean();

  if (!signal) return res.status(200).json([]);

  res.json(signal);
};

export const getSignal = async (req, res) => {
  const { signalId } = req.params;

  const signal = await Signal.findById(signalId).lean();

  if (!signal) return res.status(400).json({ message: "No signal found" });

  res.json(signal);
};

export const postSignal = async (req, res) => {
  const { userId, currency, orderType, stopLoss, price, profit1, profit2, profit3, duration, info, isDraft } = req.body;

  if (!currency) return res.status(400).json({ message: "currency field is required" });
  if (!price) return res.status(400).json({ message: "price field is required" });
  if (!stopLoss) return res.status(400).json({ message: "Stop loss field is required" });

  if (isDraft !== "Draft") {
    // Retrieve all users
    const users = await User.find().lean().exec();

    // Collect all phone numbers and create signals for each user
    const phoneNumbers = [];
    const signals = users.map(async (user) => {
      // Create signal for each user
      const signal = await Signal.create({
        user: user._id,
        currency,
        stopLoss,
        price,
        orderType,
        profit1,
        profit2,
        profit3,
        duration,
        info,
      });

      // Add phone number to the list if available
      if (user.phone) {
        phoneNumbers.push(user.phone);
      }

      await signal.save();
      return signal;
    });

    const createdSignal = await Promise.all(signals);

    if (createdSignal.length > 0) {
      return res.status(200).json({ message: "New signal created and SMS sent to all users" });
    } else {
      return res.status(400).json({ message: "Failed to create signal for all users" });
    }
  } else {
    // If it's a draft, create signal for a specific user
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(400).json({ message: "User not found" });

    const signal = await Signal.create({
      user: userId,
      currency,
      stopLoss,
      price,
      orderType,
      profit1,
      profit2,
      profit3,
      duration,
      info,
      isDraft,
    });

    await signal.save();

    if (signal) {
      return res.status(200).json({ message: "New signal draft added" });
    } else {
      return res.status(400).json({ message: "Failed to add draft" });
    }
  }
};

export const updateSignal = async (req, res) => {
  const { signalId, currency, stopLoss, isDraft, orderType, price, profit1, profit2, profit3, info, isRead, duration } =
    req.body;
  console.log(isRead);
  const signal = await Signal.findById(signalId).exec();
  if (!signal) return res.status(400).json({ message: "Signal not found" });

  if (currency) signal.currency = currency;
  if (price) signal.price = price;
  if (stopLoss) signal.stopLoss = stopLoss;
  if (profit1) signal.profit1 = profit1;
  if (profit2) signal.profit2 = profit2;
  if (profit3) signal.profit3 = profit3;
  if (info) signal.info = info;
  if (duration) signal.duration = duration;
  if (orderType) signal.orderType = orderType;
  if (isRead !== undefined) signal.isRead = isRead;

  if (isDraft === "Undraft") {
    const users = await User.find().lean().exec();

    // Collect all phone numbers and create signals for each user
    const phoneNumbers = [];
    const signals = users.map(async (user) => {
      // Create signal for each user
      const signal = await Signal.create({
        user: user._id,
        currency,
        stopLoss,
        price,
        orderType,
        profit1,
        profit2,
        profit3,
        duration,
        info,
      });

      // Add phone number to the list if available
      if (user.phone) {
        phoneNumbers.push(user.phone);
      }

      await signal.save();
      return signal;
    });

    const createdSignal = await Promise.all(signals);

    if (createdSignal.length > 0) {
      return res.status(200).json({ message: "New signal created and SMS sent to all users" });
    } else {
      return res.status(400).json({ message: "Failed to create signal for all users" });
    }
  }

  await signal.save();
  console.log(signal);
  res.json(`Signal successfully updated`);
};

export const deleteSignal = async (req, res) => {
  const { signalId } = req.params;
  console.log(req.params);
  const signal = await Signal.findById(signalId).exec();
  if (!signal) return res.status(400).json({ message: "Signal not found" });

  await signal.deleteOne();
  res.json(`Signal deleted successfully`);
};
