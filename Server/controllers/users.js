import User from "../models/User.js";
import Course from "../models/Course.js";
import Transaction from "../models/Transaction.js";
import Statistics from "../models/Statistics.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  if (!users?.length) return res.status(400).json({ message: "No users found" });
  res.json(users);
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user details and exclude the password field
    const user = await User.findById(userId).lean();
    if (!user) return res.status(400).json({ message: "No user found" });

    // Fetch transactions and certificates for the user
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).lean().exec();

    // Return merged user data with statistics and course details
    res.json({
      ...user, // User data
      transactions, // User's transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAffiliateChart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find users with affiliate.referee.userId matching the requested userId
    const referees = await User.find({ "affiliate.referee.userId": userId });

    // Define each month
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Monthly data calculation
    const monthlyData = months.map((month, index) => ({
      month,
      users: referees.filter((ref) => new Date(ref.affiliate.referee.date).getMonth() === index).length,
    }));

    // Weekly data calculation
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    });

    const weeklyData = last7Days.map((date) => ({
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      users: referees.filter((ref) => new Date(ref.affiliate.referee.date).toDateString() === date.toDateString())
        .length,
    }));

    // Send response with both monthly and weekly data
    res.json({ success: true, monthlyData, weeklyData });
  } catch (error) {
    console.error("Error generating chart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postUser = async (req, res) => {
  const { firstname, lastname, phone, username, email, role, password } = req.body;
  console.log(req.body);
  if (!username) return res.status(400).json({ message: "Username field is required" });
  if (!password) return res.status(400).json({ message: "Password field is required" });
  if (!firstname) return res.status(400).json({ message: "Firstname field is required" });
  if (!phone) return res.status(400).json({ message: "Phone field is required" });
  if (!email) return res.status(400).json({ message: "Email field is required" });

  const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateUsername) return res.status(400).json({ message: "Duplicate username" });
  const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateEmail) return res.status(400).json({ message: "Email address already exist!" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      phone,
      username,
      email,
      role,
      password: hashedPwd,
    });
    user.lastLogin = new Date();
    user.isActive = true;
    if (user) {
      await user.save();
      return res.status(200).json({ message: `New user ${username} created` });
    } else return res.status(400).json({ message: "Invalid user data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
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
    role,
    passwordReset,
    avatar,
    about,
    skills,
    bankDetails,
    activeCourseList,
    affiliate,
    notifications,
    quizData, // Quiz data coming from the request
  } = req.body;

  // Validate required fields
  if (!userId) return res.status(400).json({ message: "ID field is required" });

  // Find user by ID
  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found" });

  // Handle profile updates
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (username) {
    const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 }).lean().exec();
    if (duplicateUsername) return res.status(400).json({ message: "Duplicate username" });
    else user.username = username;
  }
  if (email) {
    const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
    if (duplicateEmail) return res.status(400).json({ message: "Email address already exists!" });
    else user.email = email;
  }
  if (phone) user.phone = phone;
  if (role) user.role = role;

  if (passwordReset) {
    if (!passwordReset.isGoogleSignIn) {
      if (!passwordReset.currentPassword)
        return res.status(400).json({ message: "Current password field is required" });
      if (passwordReset.password !== passwordReset.confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });

      const isPasswordValid = await bcrypt.compare(passwordReset.currentPassword, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: "Current Password is incorrect" });
    }

    const hashedPwd = await bcrypt.hash(passwordReset.password, 10);
    user.password = hashedPwd;
  }
  if (avatar) user.avatar = avatar;
  if (activeCourseList) user.activeCourseList = activeCourseList;
  if (affiliate) user.affiliate = affiliate;
  if (about) user.about = about;
  if (skills) user.skills = skills;
  if (notifications) user.notifications = notifications;
  if (bankDetails) user.bankDetails = bankDetails;

  // Handle quiz submission logic
  if (quizData && quizData.courseId && quizData.quizTitle && quizData.score !== undefined) {
    const { courseId, quizTitle: title, score, chapterId } = quizData;

    // Check if the course exists in the user's active course list
    const course = user.activeCourseList.find((course) => course.courseId === courseId);
    if (!course)
      return res.status(400).json({ message: `Course with ID ${courseId} not found in user's active courses` });

    // Check if the quiz has already been submitted
    const existingQuiz = course.quiz.find((quiz) => quiz.quizId === chapterId);
    if (existingQuiz)
      return res.status(400).json({
        message: `You have already submitted the quiz for this chapter.`,
      });

    // Add the new quiz score to the course's quiz array
    course.quiz.push({ title, score, quizId: chapterId });

    // Find the current chapter based on chapterId
    const currentChapterIndex = course.chapters.findIndex((chapter) => chapter.chapterId === chapterId);

    // If the current chapter exists and is valid, mark the next chapter as completed
    if (currentChapterIndex !== -1 && currentChapterIndex < course.chapters.length - 1) {
      // Mark the current chapter as completed
      course.chapters[currentChapterIndex].completed = true;

      // Mark the next chapter as completed
      course.chapters[currentChapterIndex + 1].completed = true;
    }
  }

  // if (bankDetails && bankDetails.bankName && bankDetails.accountName && bankDetails.accountNumber !== undefined) {
  //   const { bankName, accountName, accountNumber } = bankDetails;

  //   // Check if the bank already exists in the user's bank details
  //   const existingBank = user.bankDetails.find((bank) => bank.bankName === bankName);
  //   if (existingBank) return res.status(400).json({ message: `You have already added ${bankName}` });

  //   // If not found, push the new bank details
  //   user.bankDetails.push({ bankName, accountName, accountNumber });
  // }

  const updatedUser = await user.save();
  console.log(updatedUser);
  // Respond with success message
  res.json({ message: `Updated successfully` });
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found!" });

  const course = await Course.findOne({ user: userId }).lean().exec();
  if (course) return res.status(400).json({ message: "User has Courses, can't delete" });

  let statistics = await Statistics.findOne();

  statistics.deletedUserCount += 1;

  await statistics.save();
  await user.deleteOne();

  res.json({
    message: "User as been deleted from the platform",
  });
};
