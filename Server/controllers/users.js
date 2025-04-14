import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getAllUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!users?.length) {
      return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        phone: true,
        email: true,
        role: true,
        about: true,
        skills: true,
        avatarUrl: true,
        bankAccountName: true,
        bankAccountNumber: true,
        bankName: true,
        bankRecipientCode: true,
        affiliateCommissionRate: true,
        affiliateBalance: true,
        affiliateCount: true,
        affiliateConversion: true,
        affiliateLifetimeEarnings: true,
        affiliateWithdrawalCount: true,
        affiliateDueDate: true,
        affiliateRefereeUserId: true,
        affiliateRefereeDate: true,
        lastLogin: true,
        isActive: true,
        isDeleted: true,
        reviews: true,
        students: true,
        courses: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      ...user,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserAffiliateChart = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const referees = await prisma.user.findMany({
      where: { affiliateRefereeUserId: parseInt(userId) },
    });

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const monthlyData = months.map((month, index) => ({
      month,
      users: referees.filter((ref) => new Date(ref.affiliateRefereeDate).getMonth() === index).length,
    }));

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return date;
    });

    const weeklyData = last7Days.map((date) => ({
      date: date.toISOString().split('T')[0],
      users: referees.filter(
        (ref) => new Date(ref.affiliateRefereeDate).toDateString() === date.toDateString()
      ).length,
    }));

    res.json({ success: true, monthlyData, weeklyData });
  } catch (error) {
    console.error('Error generating affiliate chart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postUser = async (req, res) => {
  const { firstname, lastname, phone, username, email, role, password } = req.body;

  if (!username) return res.status(400).json({ message: 'Username field is required' });
  if (!password) return res.status(400).json({ message: 'Password field is required' });
  if (!firstname) return res.status(400).json({ message: 'Firstname field is required' });
  if (!phone) return res.status(400).json({ message: 'Phone field is required' });
  if (!email) return res.status(400).json({ message: 'Email field is required' });

  try {
    const duplicateUsername = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });

    if (duplicateUsername) {
      return res.status(400).json({ message: 'Duplicate username' });
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });

    if (duplicateEmail) {
      return res.status(400).json({ message: 'Email address already exists!' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        phone,
        username,
        email,
        role: role || 'User',
        password: hashedPwd,
        lastLogin: new Date(),
        isActive: true,
      },
    });

    res.status(200).json({ message: `New user ${username} created` });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
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
    avatarUrl,
    about,
    skills,
    bankAccountName,
    bankAccountNumber,
    bankName,
    bankRecipientCode,
    affiliateCommissionRate,
    affiliateBalance,
    affiliateCount,
    affiliateConversion,
    affiliateLifetimeEarnings,
    affiliateWithdrawalCount,
    affiliateDueDate,
    notificationsRemindersPush,
    notificationsRemindersEmail,
    notificationsRemindersSms,
    notificationsUpdatesPush,
    notificationsUpdatesEmail,
    notificationsUpdatesSms,
    notificationsOthersPush,
    notificationsOthersEmail,
    notificationsOthersSms,
    quizData,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID field is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate unique fields
    if (username && username !== user.username) {
      const duplicateUsername = await prisma.user.findFirst({
        where: { username: { equals: username, mode: 'insensitive' } },
      });
      if (duplicateUsername) {
        return res.status(400).json({ message: 'Duplicate username' });
      }
    }

    if (email && email !== user.email) {
      const duplicateEmail = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });
      if (duplicateEmail) {
        return res.status(400).json({ message: 'Email address already exists!' });
      }
    }

    // Handle password reset
    let hashedPwd = user.password;
    if (passwordReset) {
      if (!passwordReset.isGoogleSignIn) {
        if (!passwordReset.currentPassword) {
          return res.status(400).json({ message: 'Current password field is required' });
        }
        if (passwordReset.password !== passwordReset.confirmPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
        }

        const isPasswordValid = await bcrypt.compare(passwordReset.currentPassword, user.password || '');
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Current Password is incorrect' });
        }
      }

      hashedPwd = await bcrypt.hash(passwordReset.password, 10);
    }

    // Handle quiz submission
    if (quizData && quizData.courseId && quizData.quizTitle && quizData.score !== undefined) {
      const { courseId, quizTitle: title, score, chapterId } = quizData;

      // Check course enrollment
      const userCourse = await prisma.userCourse.findFirst({
        where: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
        },
        include: { quizzes: true, chapters: true, userChapter: true },
      });

      if (!userCourse) {
        return res.status(400).json({ message: `Course with ID ${courseId} not found in user's courses` });
      }

      // Check if quiz has already been submitted
      const existingQuiz = userCourse.quizScores?.find((quiz) => quiz.quizId === chapterId.toString());
      if (existingQuiz) {
        return res.status(400).json({ message: 'You have already submitted the quiz for this chapter.' });
      }

      // Create quiz score
      await prisma.quizScore.create({
        data: {
          quizId: chapterId.toString(),
          title,
          score,
          courseId: parseInt(courseId),
          userCourses: {
            connect: {
              userId_courseId: {
                userId: parseInt(userId),
                courseId: parseInt(courseId),
              },
            },
          },
        },
      });

      // Update chapter completion in UserChapter
      const chapters = await prisma.chapter.findMany({
        where: { courseId: parseInt(courseId) },
        orderBy: { id: 'asc' }, // Ensure consistent order
      });

      const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === parseInt(chapterId));
      if (currentChapterIndex === -1) {
        return res.status(400).json({ message: `Chapter with ID ${chapterId} not found in course` });
      }

      // Mark current chapter as completed
      await prisma.userChapter.upsert({
        where: {
          userId_chapterId: {
            userId: parseInt(userId),
            chapterId: parseInt(chapterId),
          },
        },
        update: {
          completed: true,
        },
        create: {
          userId: parseInt(userId),
          chapterId: parseInt(chapterId),
          completed: true,
        },
      });

      // Mark next chapter as accessible if it exists
      if (currentChapterIndex < chapters.length - 1) {
        const nextChapterId = chapters[currentChapterIndex + 1].id;
        await prisma.userChapter.upsert({
          where: {
            userId_chapterId: {
              userId: parseInt(userId),
              chapterId: nextChapterId,
            },
          },
          update: {
            completed: false, // Ensure it’s accessible but not completed
          },
          create: {
            userId: parseInt(userId),
            chapterId: nextChapterId,
            completed: false,
          },
        });
      }
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        phone: phone || user.phone,
        username: username || user.username,
        email: email || user.email,
        role: role || user.role,
        password: hashedPwd,
        avatarUrl: avatarUrl || user.avatarUrl,
        about: about || user.about,
        skills: skills || user.skills,
        bankAccountName: bankAccountName || user.bankAccountName,
        bankAccountNumber: bankAccountNumber || user.bankAccountNumber,
        bankName: bankName || user.bankName,
        bankRecipientCode: bankRecipientCode || user.bankRecipientCode,
        affiliateCommissionRate:
          affiliateCommissionRate !== undefined ? affiliateCommissionRate : user.affiliateCommissionRate,
        affiliateBalance: affiliateBalance !== undefined ? affiliateBalance : user.affiliateBalance,
        affiliateCount: affiliateCount !== undefined ? affiliateCount : user.affiliateCount,
        affiliateConversion:
          affiliateConversion !== undefined ? affiliateConversion : user.affiliateConversion,
        affiliateLifetimeEarnings:
          affiliateLifetimeEarnings !== undefined
            ? affiliateLifetimeEarnings
            : user.affiliateLifetimeEarnings,
        affiliateWithdrawalCount:
          affiliateWithdrawalCount !== undefined
            ? affiliateWithdrawalCount
            : user.affiliateWithdrawalCount,
        affiliateDueDate: affiliateDueDate || user.affiliateDueDate,
        notificationsRemindersPush:
          notificationsRemindersPush !== undefined
            ? notificationsRemindersPush
            : user.notificationsRemindersPush,
        notificationsRemindersEmail:
          notificationsRemindersEmail !== undefined
            ? notificationsRemindersEmail
            : user.notificationsRemindersEmail,
        notificationsRemindersSms:
          notificationsRemindersSms !== undefined
            ? notificationsRemindersSms
            : user.notificationsRemindersSms,
        notificationsUpdatesPush:
          notificationsUpdatesPush !== undefined
            ? notificationsUpdatesPush
            : user.notificationsUpdatesPush,
        notificationsUpdatesEmail:
          notificationsUpdatesEmail !== undefined
            ? notificationsUpdatesEmail
            : user.notificationsUpdatesEmail,
        notificationsUpdatesSms:
          notificationsUpdatesSms !== undefined
            ? notificationsUpdatesSms
            : user.notificationsUpdatesSms,
        notificationsOthersPush:
          notificationsOthersPush !== undefined
            ? notificationsOthersPush
            : user.notificationsOthersPush,
        notificationsOthersEmail:
          notificationsOthersEmail !== undefined
            ? notificationsOthersEmail
            : user.notificationsOthersEmail,
        notificationsOthersSms:
          notificationsOthersSms !== undefined ? notificationsOthersSms : user.notificationsOthersSms,
      },
    });

    res.json({ message: 'Updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const course = await prisma.course.findFirst({
      where: { userId: parseInt(userId) },
    });

    if (course) {
      return res.status(400).json({ message: "User has courses, can't delete" });
    }

    const statistics = await prisma.statistics.findFirst();

    if (statistics) {
      await prisma.statistics.update({
        where: { id: statistics.id },
        data: { deletedUserCount: { increment: 1 } },
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    res.json({ message: 'User has been deleted from the platform' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};