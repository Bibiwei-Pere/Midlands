import Statistics from "../models/Statistics.js";
import Course from "../models/Course.js";
import Payout from "../models/Payout.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const getStatistics = async (_req, res) => {
  try {
    let statistics = await Statistics.findOne();
    if (!statistics) return res.status(200).json([]);
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersStatistics = async (_req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // 1. Calculate users joining per month for the current year
    const usersPerMonthData = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`), // Start from January 1st of the current year
            $lt: new Date(`${currentYear + 1}-01-01`), // End before January 1st of the next year
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // Group by year
            month: { $month: "$createdAt" }, // Group by month
          },
          totalUsers: { $sum: 1 }, // Count users
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalUsers: 1,
        },
      },
    ]);

    // Create an array with all months of the current year initialized to 0 users
    const monthsInYear = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1, // Months are 1-indexed (1 = January, 12 = December)
      totalUsers: 0,
    }));

    // Merge the usersPerMonthData into the all months data
    usersPerMonthData.forEach(({ month, totalUsers }) => {
      monthsInYear[month - 1].totalUsers = totalUsers;
    });

    // 2. Total active users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsersLast30Days = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }, // Users who logged in within the last 30 days
    });

    // 3. Total revenue generated from completed transactions with courseId
    const totalRevenue = await Transaction.aggregate([
      {
        $match: {
          courseId: { $exists: true }, // Transactions with courseId
          completed: true, // Completed transactions
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }, // Sum up the total amount
        },
      },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0; // Handle case where no revenue

    // 4. Total users on the platform
    const totalUsers = await User.countDocuments();

    res.json({
      usersPerMonth: monthsInYear, // List of users per month (with 0 for months with no users)
      activeUsersLast30Days, // Total active users in the last 30 days
      totalRevenue: revenue, // Total revenue generated
      totalUsers,
      currentYear,
    });
  } catch (error) {
    console.error("Error calculating users per month:", error);
    res.status(500).json({ error: "Error calculating users per month" });
  }
};

export const getSaleStatistics = async (_req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // 1. Completed transactions with courseId, grouped by month for the current year
    const completedTransactionsData = await Transaction.aggregate([
      {
        $match: {
          courseId: { $exists: true }, // Ensure the transaction has a courseId
          completed: true, // Only completed transactions
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`), // Start from January 1st of the current year
            $lt: new Date(`${currentYear + 1}-01-01`), // End before January 1st of the next year
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } }, // Group by month
          totalAmount: { $sum: "$amount" }, // Sum the transaction amounts
          totalTransactions: { $sum: 1 }, // Count the number of transactions
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalAmount: 1,
          totalTransactions: 1,
        },
      },
    ]);

    // Initialize array for 12 months (1 = January, 12 = December) with 0 totals
    const monthsInYear = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalAmount: 0,
      totalTransactions: 0,
    }));

    // Merge the completedTransactionsData into the monthsInYear array
    completedTransactionsData.forEach(({ month, totalAmount, totalTransactions }) => {
      monthsInYear[month - 1].totalAmount = totalAmount;
      monthsInYear[month - 1].totalTransactions = totalTransactions;
    });

    // 2. Total course sold (total amount in completed transactions with courseId)
    const totalCourseSold = await Transaction.aggregate([
      {
        $match: {
          courseId: { $exists: true }, // Ensure courseId exists
          completed: true, // Only completed transactions
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`), // Filter by current year
            $lt: new Date(`${currentYear + 1}-01-01`), // End before the next year starts
          },
        },
      },
      {
        $group: {
          _id: null, // We are summing everything, no need to group by courseId
          totalAmount: { $sum: "$amount" }, // Sum the amounts
        },
      },
    ]);

    const totalCourseRevenue = totalCourseSold.length > 0 ? totalCourseSold[0].totalAmount : 0;

    // 3. Total amount in payouts with status "Pending Approval"
    const pendingPayouts = await Payout.aggregate([
      {
        $match: {
          status: "Pending Approval", // Only payouts with "Pending Approval" status
        },
      },
      {
        $group: {
          _id: null,
          totalPendingAmount: { $sum: "$amount" }, // Sum the payout amounts
        },
      },
    ]);

    const totalPendingPayouts = pendingPayouts.length > 0 ? pendingPayouts[0].totalPendingAmount : 0;

    // 4. Total approved payouts
    const approvedPayouts = await Payout.aggregate([
      {
        $match: {
          status: "Approved", // Only payouts with "Approved" status
        },
      },
      {
        $group: {
          _id: null,
          totalApprovedAmount: { $sum: "$amount" }, // Sum the approved payout amounts
        },
      },
    ]);

    const totalApprovedPayouts = approvedPayouts.length > 0 ? approvedPayouts[0].totalApprovedAmount : 0;

    // Combine approved payouts and completed transactions with courseId
    const totalAmountWithApprovedPayouts = totalCourseRevenue + totalApprovedPayouts;

    // 5. Total rejected payouts
    const rejectedPayouts = await Payout.aggregate([
      {
        $match: {
          status: "Rejected", // Only payouts with "Rejected" status
        },
      },
      {
        $group: {
          _id: null,
          totalRejectedAmount: { $sum: "$amount" }, // Sum the rejected payout amounts
        },
      },
    ]);

    const totalRejectedPayouts = rejectedPayouts.length > 0 ? rejectedPayouts[0].totalRejectedAmount : 0;

    // Return the aggregated statistics
    res.json({
      completedTransactions: monthsInYear, // Grouped transactions by month
      totalCourseRevenue, // Total revenue from completed transactions
      totalPendingPayouts, // Total pending payout amount
      totalApprovedPayouts, // Total approved payout amount
      totalRejectedPayouts,
      totalAmountWithApprovedPayouts, // Total amount including approved payouts and completed transactions
      currentYear,
    });
  } catch (error) {
    console.error("Error calculating sales statistics:", error);
    res.status(500).json({ error: "Error calculating sales statistics" });
  }
};

export const getCourseStatistics = async (_req, res) => {
  try {
    // Step 1: Fetch all courses
    const courses = await Course.find();

    // Step 2: Initialize the categories (Beginner, Intermediate, Advanced/Strategy)
    const categories = ["Beginner", "Intermediate", "Advanced/Strategy"];

    // Step 3: Prepare an array to hold the statistics for each category
    const stats = [];

    for (const category of categories) {
      // Step 4: Filter courses by the current category
      const categoryCourses = courses.filter((course) => course.category === category);

      // Step 5: Calculate total price for the category
      const totalPrice = categoryCourses.reduce((sum, course) => sum + course.price, 0);

      // Step 6: Count total chapters in all courses for this category
      const totalChapters = categoryCourses.reduce((sum, course) => sum + course.chapters.length, 0);

      // Step 7: Sum up total ratings for this category
      const totalRatings = categoryCourses.reduce((sum, course) => sum + course.ratings.total, 0);

      // Step 8: Fetch total users and orders from the Transaction model for each course in this category
      const totalUsers = await Transaction.countDocuments({
        courseId: { $in: categoryCourses.map((course) => course._id) },
        completed: true,
      });

      const totalOrders = await Transaction.countDocuments({
        courseId: { $in: categoryCourses.map((course) => course._id) },
      });

      // Step 9: Push the result object for this category to the stats array
      stats.push({
        category: category,
        totalPrice: totalPrice,
        totalChapters: totalChapters,
        totalRatings: totalRatings,
        totalUsers: totalUsers,
        totalOrders: totalOrders,
      });
    }

    res.json(stats);
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    throw new Error("Failed to get course statistics");
  }
};

export const getLeaderBoardStats = async (_req, res) => {
  try {
    // Step 1: Fetch users
    const users = await User.find();

    // Step 2: Initialize leaderboard array
    let leaderboard = [];

    // Step 3: Iterate through each user
    for (const user of users) {
      // Step 4: Count the number of courses purchased by the user (completed transactions)
      const coursePurchases = await Transaction.countDocuments({
        user: user._id,
        courseId: { $exists: true },
        completed: true,
      });

      // Step 5: Build the leaderboard entry for each user
      leaderboard.push({
        name: {
          fullName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username, // Use full name or username if name is missing
          avatar: user.avatar.url, // Avatar URL
        },
        courses: coursePurchases, // Number of courses purchased
      });
    }

    // Step 6: Sort leaderboard by courses purchased in descending order
    leaderboard.sort((a, b) => b.courses - a.courses);

    // Step 7: Assign rank based on the sorted order
    leaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error("Failed to get leaderboard");
  }
};

export const getTeacherCourseStats = async (_req, res) => {
  try {
    // Step 1: Fetch all Teachers
    const teachers = await User.find({ role: "Teacher" }).select("_id name").lean();

    const categories = ["Beginner", "Intermediate", "Advanced/Strategy"];
    const categoryData = categories.map((category) => ({
      category,
      totalUsers: 0,
      activePercentage: 0,
      quizPercentage: 0,
    }));

    for (const teacher of teachers) {
      const teacherCourses = await Course.find({ user: teacher._id }).lean();

      // Step 2: Process each category (Beginner, Intermediate, Advanced/Strategy)
      for (const categoryObj of categoryData) {
        const categoryCourses = teacherCourses.filter((course) => course.category === categoryObj.category);

        // Step 3: Get total users who bought courses (completed transactions)
        const courseIds = categoryCourses.map((course) => course._id);
        const completedTransactions = await Transaction.find({
          courseId: { $in: courseIds },
          completed: true,
        }).lean();

        categoryObj.totalUsers += new Set(completedTransactions.map((tx) => tx.user)).size;

        // Step 4: Calculate Active Courses (Published)
        const publishedCourses = categoryCourses.filter((course) => course.status === "Published");
        categoryObj.activePercentage =
          categoryObj.activePercentage + (publishedCourses.length / categoryCourses.length) * 100 || 0;

        // Step 5: Calculate Task & Exams (Quizzes)
        const totalQuizzes = categoryCourses.reduce(
          (sum, course) =>
            sum + course.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.quiz.questions.length, 0),
          0
        );
        categoryObj.quizPercentage = categoryObj.quizPercentage + totalQuizzes / categoryCourses.length || 0;
      }
    }

    // Step 6: Return the result as an array
    res.json(categoryData);
  } catch (error) {
    console.error("Error fetching teacher course stats:", error);
    res.status(500).json({ error: "Error fetching teacher course stats" });
  }
};

export const getTeacherCourseStatsById = async (req, res) => {
  const { userId } = req.params; // Assume this is the teacher's ID
  try {
    // Step 1: Fetch the specified teacher
    const teacher = await User.findOne({ _id: userId, role: "Teacher" }).select("_id name").lean();

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const categories = ["Beginner", "Intermediate", "Advanced/Strategy"];
    const categoryData = categories.map((category) => ({
      category,
      totalUsers: 0,
      activePercentage: 0,
      quizPercentage: 0,
    }));

    // Fetch courses for this teacher
    const teacherCourses = await Course.find({ user: teacher._id }).lean();

    // Step 2: Process each category (Beginner, Intermediate, Advanced/Strategy)
    for (const categoryObj of categoryData) {
      const categoryCourses = teacherCourses.filter((course) => course.category === categoryObj.category);

      if (categoryCourses.length === 0) continue; // Skip if no courses in this category

      // Step 3: Get total users who bought courses (completed transactions)
      const courseIds = categoryCourses.map((course) => course._id);
      const completedTransactions = await Transaction.find({
        courseId: { $in: courseIds },
        completed: true,
      }).lean();

      // Calculate unique users who purchased courses in this category
      categoryObj.totalUsers = new Set(completedTransactions.map((tx) => tx.user)).size;

      // Step 4: Calculate Active Courses (Published)
      const publishedCourses = categoryCourses.filter((course) => course.status === "Published");
      categoryObj.activePercentage = (publishedCourses.length / categoryCourses.length) * 100 || 0;

      // Step 5: Calculate Task & Exams (Quizzes)
      const totalQuizzes = categoryCourses.reduce(
        (sum, course) =>
          sum + course.chapters.reduce((chapterSum, chapter) => chapterSum + (chapter.quiz.questions.length || 0), 0),
        0
      );
      categoryObj.quizPercentage = totalQuizzes / categoryCourses.length || 0;
    }

    // Step 6: Return the result as an array
    res.json(categoryData);
  } catch (error) {
    console.error("Error fetching teacher course stats:", error);
    res.status(500).json({ error: "Error fetching teacher course stats" });
  }
};

export const getTopEarningCourses = async (req, res) => {
  try {
    // Step 1: Fetch all completed transactions with courseId
    const transactions = await Transaction.aggregate([
      {
        $match: {
          completed: true, // Only completed transactions
          courseId: { $exists: true, $ne: "" }, // Ensure courseId is present
        },
      },
      {
        $group: {
          _id: "$courseId", // Group by courseId
          totalAmount: { $sum: "$amount" }, // Sum the total amount for each course
          totalUsers: { $addToSet: "$user" }, // Collect unique users who bought the course
        },
      },
      {
        $project: {
          totalAmount: 1,
          totalUsersCount: { $size: "$totalUsers" }, // Calculate number of unique users
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by totalAmount in descending order
      },
      {
        $limit: 3, // Limit to the top 3 courses
      },
    ]);

    // Step 2: Get course details for the top 3 courses
    const topCourses = await Course.find({
      _id: { $in: transactions.map((t) => t._id) }, // Match with courseId from transactions
    }).lean();

    // Step 3: Prepare the response data
    const result = transactions.map((transaction) => {
      const course = topCourses.find((c) => c._id.toString() === transaction._id.toString());

      // Check if course exists
      if (!course) {
        console.warn(`No course found for transaction with _id: ${transaction._id}`);
        return {
          course: {
            _id: transaction._id,
            title: "Unknown Course",
            description: "No details available",
            price: 0,
          },
          totalAmount: transaction.totalAmount,
          totalUsersCount: transaction.totalUsersCount,
        };
      }

      return {
        course: {
          _id: course._id,
          title: course.title,
          description: course.miniDescription || course.description,
          price: course.price,
        },
        totalAmount: transaction.totalAmount, // Amount generated by the course
        totalUsersCount: transaction.totalUsersCount, // Number of users who bought the course
      };
    });

    // Step 4: Return the result
    res.status(200).json({ topCourses: result });
  } catch (error) {
    console.error("Error fetching top earning courses:", error);
    res.status(500).json({ message: "Error fetching top earning courses" });
  }
};
