import User from "../models/User.js";
import Course from "../models/Course.js";
import Transaction from "../models/Transaction.js";
import Certificate from "../models/Certificate.js";
import bcrypt from "bcrypt";

export const getUsersStatistics = async (_req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Active users: those who have logged in today
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: startOfDay },
    isActive: true,
  }).exec();

  // Inactive users: those who haven't logged in today or are marked inactive
  const inactiveUsers = await User.countDocuments({
    $or: [{ lastLogin: { $lt: startOfDay } }, { isActive: false }],
  }).exec();

  res.json({
    activeUsers,
    inactiveUsers,
  });
};

export const getAllUsers = async (_req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length)
    return res.status(400).json({ message: "No users found" });

  res.json(users);
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password").lean();
  if (!user) return res.status(400).json({ message: "No user found" });

  let activeCourseList = [];
  if (user.activeCourses > 0) {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    // Map over all courses and compare course IDs with user's paidCourses array
    activeCourseList = await Promise.all(
      courses.map(async (course) => {
        const isPaidCourse = user.paidCourses.includes(course._id.toString());
        return {
          ...course,
          isPaid: isPaidCourse,
        };
      })
    );
  }

  // Fetch transactions and certificates for the user
  const transactions = await Transaction.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  const certificates = await Certificate.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  // Respond with the user data, registered courses, transactions, and certificates
  res.json({
    ...user,
    activeCourseList,
    transactions,
    certificates,
  });
};

export const createNewUser = async (req, res) => {
  const {
    firstname,
    lastname,
    phone,
    username,
    email,
    roles,
    password,
    confirmPassword,
  } = req.body;

  if (!username)
    return res.status(400).json({ message: "Username field is required" });
  if (!email)
    return res.status(400).json({ message: "Email field is required" });
  if (!password)
    return res.status(400).json({ message: "Password field is required" });
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const duplicateUsername = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicateUsername)
    return res.status(400).json({ message: "Duplicate username" });
  const duplicateEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicateEmail)
    return res.status(400).json({ message: "Email address already exist!" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const userObject =
      !Array.isArray(roles) || !roles.length
        ? {
            firstname,
            lastname,
            phone,
            username,
            email,
            password: hashedPwd,
          }
        : {
            firstname,
            lastname,
            phone,
            username,
            email,
            roles,
            password: hashedPwd,
          };

    const user = await User.create(userObject);

    if (user)
      return res.status(200).json({ message: `New user ${username} created` });
    else return res.status(400).json({ message: "Invalid user data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const {
    userId,
    firstname,
    lastname,
    phone,
    username,
    email,
    roles,
    password,
    avatar,
    bankDetails,
    activeCourses,
    activeCourseList,
    affiliate,
  } = req.body;

  if (!userId) return res.status(400).json({ message: "ID field is required" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found" });

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (username) {
    const duplicateUsername = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateUsername)
      return res.status(400).json({ message: "Duplicate username" });
    else user.username = username;
  }
  if (email) {
    const duplicateEmail = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateEmail)
      return res.status(400).json({ message: "Email address already exist!" });
    else user.email = email;
  }
  if (phone) user.phone = phone;
  if (roles) user.roles = roles;
  if (password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    user.password = hashedPwd;
  }
  if (avatar) user.avatar = avatar;
  if (activeCourseList) user.activeCourseList = activeCourseList;
  if (bankDetails) user.bankDetails = bankDetails;
  if (activeCourses) user.activeCourses = activeCourses;
  if (affiliate) user.affiliate = affiliate;

  const updateUser = await user.save();

  res.json({ message: `${updateUser.username} successfully updated` });
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "User ID required" });

  const transaction = await Transaction.findOne({ user: id }).lean().exec();
  if (transaction)
    return res
      .status(400)
      .json({ message: "User has transactions, can't delete" });

  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: "User not found!" });

  await user.deleteOne();
  res.json("User successfully deleted");
};
