import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStatistics = async (_req, res) => {
  try {
    const statistics = await prisma.statistics.findMany();

    if (!statistics) {
      return res.status(200).json([]);
    }

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsersStatistics = async (_req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // 1. Calculate users joining per month for the current year
    const usersPerMonthData = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
      _count: {
        id: true,
      },
    });

    // Transform data to group by month
    const monthsInYear = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalUsers: 0,
    }));

    usersPerMonthData.forEach((data) => {
      const month = new Date(data.createdAt).getMonth() + 1;
      monthsInYear[month - 1].totalUsers = data._count.id;
    });

    // 2. Total active users in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsersLast30Days = await prisma.user.count({
      where: {
        lastLogin: { gte: thirtyDaysAgo },
      },
    });

    // 3. Total revenue generated from completed transactions with courseId
    const totalRevenue = await prisma.transaction.aggregate({
      where: {
        courseId: { not: null },
        completed: true,
      },
      _sum: {
        amount: true,
      },
    });

    const revenue = totalRevenue._sum.amount || 0;

    // 4. Total users on the platform
    const totalUsers = await prisma.user.count();

    res.json({
      usersPerMonth: monthsInYear,
      activeUsersLast30Days,
      totalRevenue: revenue,
      totalUsers,
      currentYear,
    });
  } catch (error) {
    console.error('Error calculating users per month:', error);
    res.status(500).json({ error: 'Error calculating users per month' });
  }
};

export const getSaleStatistics = async (_req, res) => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // 1. Completed transactions with courseId, grouped by month
    const completedTransactionsData = await prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        courseId: { not: null },
        completed: true,
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    // Initialize array for 12 months
    const monthsInYear = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalAmount: 0,
      totalTransactions: 0,
    }));

    // Merge data by month
    completedTransactionsData.forEach((data) => {
      const month = new Date(data.createdAt).getMonth() + 1;
      monthsInYear[month - 1].totalAmount = data._sum.amount || 0;
      monthsInYear[month - 1].totalTransactions = data._count.id;
    });

    // 2. Total course sold (total amount in completed transactions with courseId)
    const totalCourseSold = await prisma.transaction.aggregate({
      where: {
        courseId: { not: null },
        completed: true,
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalCourseRevenue = totalCourseSold._sum.amount || 0;

    // 3. Total amount in payouts with status "Pending Approval"
    const pendingPayouts = await prisma.payout.aggregate({
      where: {
        status: 'Pending Approval',
      },
      _sum: {
        amount: true,
      },
    });

    const totalPendingPayouts = pendingPayouts._sum.amount || 0;

    // 4. Total approved payouts
    const approvedPayouts = await prisma.payout.aggregate({
      where: {
        status: 'Approved',
      },
      _sum: {
        amount: true,
      },
    });

    const totalApprovedPayouts = approvedPayouts._sum.amount || 0;

    // Combine approved payouts and completed transactions
    const totalAmountWithApprovedPayouts = totalCourseRevenue + totalApprovedPayouts;

    // 5. Total rejected payouts
    const rejectedPayouts = await prisma.payout.aggregate({
      where: {
        status: 'Rejected',
      },
      _sum: {
        amount: true,
      },
    });

    const totalRejectedPayouts = rejectedPayouts._sum.amount || 0;

    res.json({
      completedTransactions: monthsInYear,
      totalCourseRevenue,
      totalPendingPayouts,
      totalApprovedPayouts,
      totalRejectedPayouts,
      totalAmountWithApprovedPayouts,
      currentYear,
    });
  } catch (error) {
    console.error('Error calculating sales statistics:', error);
    res.status(500).json({ error: 'Error calculating sales statistics' });
  }
};

export const getCourseStatistics = async (_req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { chapters: true },
    });

    const categories = ['Beginner', 'Intermediate', 'Advanced/Strategy'];
    const stats = [];

    for (const category of categories) {
      const categoryCourses = courses.filter((course) => course.category === category);

      const totalPrice = categoryCourses.reduce((sum, course) => sum + course.price, 0);
      const totalChapters = categoryCourses.reduce((sum, course) => sum + course.chapters.length, 0);
      const totalRatings = categoryCourses.reduce((sum, course) => sum + course.ratingsTotal, 0);

      const courseIds = categoryCourses.map((course) => course.id);
      const totalUsers = await prisma.transaction.count({
        where: {
          courseId: { in: courseIds },
          completed: true,
        },
      });

      const totalOrders = await prisma.transaction.count({
        where: {
          courseId: { in: courseIds },
        },
      });

      stats.push({
        category,
        totalPrice,
        totalChapters,
        totalRatings,
        totalUsers,
        totalOrders,
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching course statistics:', error);
    res.status(500).json({ error: 'Failed to get course statistics' });
  }
};

export const getLeaderBoardStats = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        username: true,
        avatarUrl: true,
      },
    });

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const coursePurchases = await prisma.transaction.count({
          where: {
            userId: user.id,
            courseId: { not: null },
            completed: true,
          },
        });

        return {
          name: {
            fullName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
            avatar: user.avatarUrl,
          },
          courses: coursePurchases,
        };
      })
    );

    const sortedLeaderboard = leaderboard
      .sort((a, b) => b.courses - a.courses)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

    res.json(sortedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
};

export const getTeacherCourseStats = async (_req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'Teacher' },
      select: { id: true, username: true },
    });

    const categories = ['Beginner', 'Intermediate', 'Advanced/Strategy'];
    const categoryData = categories.map((category) => ({
      category,
      totalUsers: 0,
      activePercentage: 0,
      quizPercentage: 0,
    }));

    for (const teacher of teachers) {
      const teacherCourses = await prisma.course.findMany({
        where: { userId: teacher.id },
        include: {
          chapters: {
            include: {
              questions: true, // Include Question records
            },
          },
        },
      });

      for (const categoryObj of categoryData) {
        const categoryCourses = teacherCourses.filter((course) => course.category === categoryObj.category);

        if (categoryCourses.length === 0) continue;

        const courseIds = categoryCourses.map((course) => course.id);
        const completedTransactions = await prisma.transaction.findMany({
          where: {
            courseId: { in: courseIds },
            completed: true,
          },
          select: { userId: true },
        });

        categoryObj.totalUsers += new Set(completedTransactions.map((tx) => tx.userId)).size;

        const publishedCourses = categoryCourses.filter((course) => course.status === 'Published');
        categoryObj.activePercentage +=
          (publishedCourses.length / categoryCourses.length) * 100 / teachers.length || 0;

        const totalQuizzes = categoryCourses.reduce(
          (sum, course) =>
            sum +
            course.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.questions.length, 0),
          0
        );
        categoryObj.quizPercentage += totalQuizzes / categoryCourses.length / teachers.length || 0;
      }
    }

    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching teacher course stats:', error);
    res.status(500).json({ error: 'Error fetching teacher course stats' });
  }
};

export const getTeacherCourseStatsById = async (req, res) => {
  const { userId } = req.params;

  try {
    const teacher = await prisma.user.findFirst({
      where: { id: parseInt(userId), role: 'Teacher' },
      select: { id: true, username: true },
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const categories = ['Beginner', 'Intermediate', 'Advanced/Strategy'];
    const categoryData = categories.map((category) => ({
      category,
      totalUsers: 0,
      activePercentage: 0,
      quizPercentage: 0,
    }));

    const teacherCourses = await prisma.course.findMany({
      where: { userId: parseInt(userId) },
      include: {
        chapters: {
          include: {
            questions: true, // Include Question records
          },
        },
      },
    });

    for (const categoryObj of categoryData) {
      const categoryCourses = teacherCourses.filter((course) => course.category === categoryObj.category);

      if (categoryCourses.length === 0) continue;

      const courseIds = categoryCourses.map((course) => course.id);
      const completedTransactions = await prisma.transaction.findMany({
        where: {
          courseId: { in: courseIds },
          completed: true,
        },
        select: { userId: true },
      });

      categoryObj.totalUsers = new Set(completedTransactions.map((tx) => tx.userId)).size;

      const publishedCourses = categoryCourses.filter((course) => course.status === 'Published');
      categoryObj.activePercentage = (publishedCourses.length / categoryCourses.length) * 100 || 0;

      const totalQuizzes = categoryCourses.reduce(
        (sum, course) =>
          sum +
          course.chapters.reduce((chapterSum, chapter) => chapterSum + chapter.questions.length, 0),
        0
      );
      categoryObj.quizPercentage = totalQuizzes / categoryCourses.length || 0;
    }

    res.json(categoryData);
  } catch (error) {
    console.error('Error fetching teacher course stats:', error);
    res.status(500).json({ error: 'Error fetching teacher course stats' });
  }
};
export const getTopEarningCourses = async (_req, res) => {
  try {
    const transactions = await prisma.transaction.groupBy({
      by: ['courseId'],
      where: {
        completed: true,
        courseId: { not: null },
      },
      _sum: {
        amount: true,
      },
      _count: {
        userId: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 3,
    });

    const courseIds = transactions.map((t) => t.courseId).filter(Boolean);
    const topCourses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: {
        id: true,
        title: true,
        miniDescription: true,
        description: true,
        price: true,
      },
    });

    const result = transactions.map((transaction) => {
      const course = topCourses.find((c) => c.id === transaction.courseId);

      if (!course) {
        console.warn(`No course found for transaction with courseId: ${transaction.courseId}`);
        return {
          course: {
            id: transaction.courseId,
            title: 'Unknown Course',
            description: 'No details available',
            price: 0,
          },
          totalAmount: transaction._sum.amount || 0,
          totalUsersCount: transaction._count.userId || 0,
        };
      }

      return {
        course: {
          id: course.id,
          title: course.title,
          description: course.miniDescription || course.description,
          price: course.price,
        },
        totalAmount: transaction._sum.amount || 0,
        totalUsersCount: transaction._count.userId || 0,
      };
    });

    res.status(200).json({ topCourses: result });
  } catch (error) {
    console.error('Error fetching top earning courses:', error);
    res.status(500).json({ error: 'Error fetching top earning courses' });
  }
};