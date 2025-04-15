import { PrismaClient } from '@prisma/client';
import { createNotification } from './notification.js';

const prisma = new PrismaClient();

export const getUserTransaction = async (req, res) => {
  const userId = req.params.Id; // Assume userId comes from params or auth middleware

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(userId) },
    });

    if (!transactions?.length) {
      return res.status(404).json({ message: 'Transactions not found' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPatchTransaction = async (req, res) => {
  const {
    transactionId,
    completed,
    status,
    reference,
    product,
    transactionType,
    amount,
    duration,
    courseId,
    instructorId,
    notificationTitle,
    notificationDesc,
  } = req.body;

  try {
    await updateTransaction(req, res);
  } catch (error) {
    console.error('Error patching transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllTransaction = async (_req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, userCourses: true, course: true } } },
    });

    if (!transactions?.length) {
      return res.status(400).json({ message: 'No transactions found' });
    }

    const transactionWithUser = transactions.map((transaction) => ({
      ...transaction,
      username: transaction.user?.username || 'Unknown',
      activeCourses: transaction.user?.userCourses?.length || 0,
    }));

    res.json(transactionWithUser);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCourseTransaction = async (_req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        courseId: { not: null },
        active: true,
      },
      include: {
        course: { select: { id: true, title: true } },
        user: { select: { id: true, username: true, userCourses: true } },
      },
    });

    if (!transactions?.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching course transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCourseTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
      include: { course: { select: { id: true, title: true } } },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching course transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postTransaction = async (req, res) => {
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
    notificationTitle,
    notificationDesc,
  } = req.body;

  // Validate required fields
  if (!userId) return res.status(400).json({ message: 'User field is required' });
  if (!product) return res.status(400).json({ message: 'Product field is required' });
  if (!transactionType) return res.status(400).json({ message: 'TransactionType field is required' });
  if (!amount) return res.status(400).json({ message: 'Amount field is required' });

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for duplicate course purchase
    if (courseId) {
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          userId: parseInt(userId),
          courseId: parseInt(courseId),
          completed: true,
        },
      });

      if (existingTransaction) {
        return res.status(400).json({ message: 'You have already purchased this course' });
      }
    }

    // Check for duplicate book session
    if (bookSession?.program) {
      const existingSession = await prisma.bookSession.findFirst({
        where: {
          userId: parseInt(userId),
          program: product,
          status: { in: ['Pending', 'Successful'] },
        },
      });

      if (existingSession) {
        return res.status(400).json({ message: 'You have already booked this session' });
      }
    }

    // Create transaction data
    const transactionData = {
      userId: parseInt(userId),
      product,
      transactionType,
      amount: parseFloat(amount),
      reference: reference || null,
      courseId: courseId ? parseInt(courseId) : null,
      duration: duration ? parseInt(duration) : 0,
      bookingSessionId: null,
    };

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: transactionData,
    });

    let bookSessionId = null;

    // Handle book session creation
    if (bookSession) {
      const newBookSession = await prisma.bookSession.create({
        data: {
          userId: parseInt(userId),
          program: product,
          bookSessionName: bookSession.name || '',
          bookSessionNumber: bookSession.number || '',
          bookSessionEmail: bookSession.email || '',
          bookSessionDate: bookSession.date ? new Date(bookSession.date) : null,
          paymentMethod: paymentMethod || 'Paystack',
          transactionId: transaction.id.toString(),
        },
      });

      bookSessionId = newBookSession.id;

      // Update transaction with bookingSessionId
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { bookingSessionId: newBookSession.id },
      });

      // Send notifications for specific payment methods
      if (['USD Transfer', 'Cryptocurrency'].includes(paymentMethod)) {
        await createNotification({
          id: userId,
          title: notificationTitle || 'Booking Confirmation',
          text: notificationDesc || 'Your booking has been received',
          product,
        });

        const adminUsers = await prisma.user.findMany({
          where: { role: 'Admin' },
        });

        for (const admin of adminUsers) {
          await createNotification({
            id: admin.id.toString(),
            title: notificationTitle || 'New Booking Payment',
            text: `${bookSession.name || 'User'} just made payment for ${product} via ${paymentMethod}, Confirm`,
            product,
          });
        }
      }
    }

    res.status(200).json({ transactionId: transaction.id, bookSessionId });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransaction = async (req, res) => {
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

  if (!transactionId) {
    return res.status(400).json({ message: 'transactionId field is required' });
  }
  if (completed === undefined) {
    return res.status(400).json({ message: 'Completed field is required' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: transaction.userId },
      include: {
        userCourses: true
      }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedUserData = {};

    // Handle course-related transactions
    if (courseId && duration) {
      const course = await prisma.course.findUnique({
        where: { id: parseInt(courseId) },
      });

      if (!course) {
        return res.status(400).json({ message: 'Course not found' });
      }

      const courseChapters = await prisma.chapter.findMany({
        where: { courseId: parseInt(courseId) },
      }).then(chapters =>
        chapters.map((chapter, index) => ({
          chapterId: chapter.id,
          completed: index === 0,
        }))
      );

      updatedUserData.userCourses = currentUser.userCourses || [];

      if (course.category === '3in1') {
        const selectedCourseIds = JSON.parse(course.selectedCourseIds || '[]');
        for (const selectedCourseId of selectedCourseIds) {
          const selectedCourse = await prisma.course.findUnique({
            where: { id: parseInt(selectedCourseId) },
          });

          if (!selectedCourse) continue;

          const selectedCourseChapters = await prisma.chapter.findMany({
            where: { courseId: parseInt(selectedCourseId) },
          }).then(chapters =>
            chapters.map((chapter, index) => ({
              chapterId: chapter.id,
              completed: index === 0,
            }))
          );

          updatedUserData.userCourses.push({
            courseId: selectedCourseId,
            duration,
            commission: selectedCourse.commission,
            chapters: selectedCourseChapters,
          });
        }
      } else {
        updatedUserData.userCourses.push({
          courseId,
          duration,
          commission: course.commission,
          chapters: courseChapters,
        });
      }

      // Update affiliate data
      if (currentUser.affiliateRefereeUserId) {
        const referee = await prisma.user.findUnique({
          where: { id: currentUser.affiliateRefereeUserId },
        });

        if (referee) {
          const commissionAmount = (course.commission / 100) * course.price;
          await prisma.user.update({
            where: { id: referee.id },
            data: {
              affiliateCommissionRate: { increment: course.commission },
              affiliateConversion: { increment: 1 },
              affiliateBalance: { increment: commissionAmount },
              affiliateLifetimeEarnings: { increment: commissionAmount },
            },
          });
        }
      }

      // Update instructor data
      const instructor = await prisma.user.findUnique({
        where: { id: course.userId },
      });

      if (!instructor) {
        return res.status(400).json({ message: 'Instructor not found' });
      }

      await prisma.user.update({
        where: { id: instructor.id },
        data: {
          students: { increment: 1 },
          courses: { increment: 1 },
        },
      });
    }

    // Handle book session transactions
    if (transactionType === 'Book Session' && bookSessionId) {
      const booked = await prisma.bookSession.findUnique({
        where: { id: parseInt(bookSessionId) },
      });

      if (!booked) {
        return res.status(400).json({ message: 'Book session not found' });
      }

      if (status === 'Successful') {
        updatedUserData.bookSession = currentUser.bookSession || [];
        updatedUserData.bookSession.push({
          bookId: booked.id,
          program: product,
        });
      }

      await prisma.bookSession.update({
        where: { id: parseInt(bookSessionId) },
        data: { status: status || booked.status },
      });
    }

    // Send notification
    if (notificationTitle && notificationDesc) {
      await createNotification({
        id: currentUser.id.toString(),
        title: notificationTitle,
        text: notificationDesc,
        product,
      });
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: parseInt(transactionId) },
      data: {
        completed,
        status: status || transaction.status,
      },
    });

    // Update user
    if (Object.keys(updatedUserData).length) {
      await prisma.$transaction(async (tx) => {
        // Handle course assignments
        for (const uc of updatedUserData.userCourses) {
          // Create or update UserCourse
          const userCourse = await tx.userCourse.upsert({
            where: {
              userId_courseId: {
                userId: currentUser.id,
                courseId: uc.courseId
              }
            },
            update: {
              duration: uc.duration,
              commission: uc.commission
            },
            create: {
              userId: currentUser.id,
              courseId: uc.courseId,
              duration: uc.duration,
              commission: uc.commission
            }
          });

          // Handle chapter progress
          for (const chapter of uc.chapters) {
            await tx.userChapter.upsert({
              where: {
                userId_chapterId: {
                  userId: currentUser.id,
                  chapterId: chapter.chapterId
                }
              },
              update: {
                completed: chapter.completed
              },
              create: {
                userId: currentUser.id,
                chapterId: chapter.chapterId,
                completed: chapter.completed
              }
            });
          }
        }
      });
    }

    res.status(200).json({ message: 'Transaction successfully updated' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTransaction = async (req, res) => {
  const { transactionId } = req.body;

  try {
    if (!transactionId) {
      const result = await prisma.transaction.deleteMany({});
      if (result.count > 0) {
        return res.json({ message: 'All transactions deleted' });
      }
      return res.status(400).json({ message: 'No transactions found to delete' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await prisma.transaction.delete({
      where: { id: parseInt(transactionId) },
    });

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};