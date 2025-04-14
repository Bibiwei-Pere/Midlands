import { PrismaClient } from '@prisma/client';
import { generateSignedUrl } from './fileUpload.js';

const prisma = new PrismaClient();

export const cron = async () => {
  await updateActiveCourses();
  await updateFiles();
  await allStatistics();
  await updatePayoutDate();
};

const updateActiveCourses = async () => {
  try {
    // Find all users (excluding sensitive data like password)
    const users = await prisma.user.findMany({
      include: {
        userCourses: true
      }
    });

    if (!users?.length) return console.log('No users found');

    // Filter users who have active courses
    const usersWithActiveCourses = users.filter(
      (user) => Array.isArray(user.userCourses) && user.userCourses.length > 0
    );

    // Loop through users with active courses
    for (const user of usersWithActiveCourses) {
      const updatedActiveCourseList = user.userCourses
        .map((course) => {
          if (course.duration > 1) {
            return { ...course, duration: course.duration - 1 };
          }
          return null; // Mark for removal
        })
        .filter((course) => course !== null); // Remove courses with duration <= 1

      // Update the user's activeCourseList
      await prisma.user.update({
        where: { id: user.id },
        data: {
          userCourses: updatedActiveCourseList,
        },
      });
    }

    console.log('Active courses updated successfully');
  } catch (error) {
    console.log('Error updating active courses:', error);
  }
};

const updateFiles = async () => {
  try {
    // Find all courses
    const courses = await prisma.course.findMany({
      include: {
        chapters: {
          include: {
            uploadedFiles: true
          }
        }, // Include chapters relation
      },
    });

    if (!courses?.length) return console.log('No courses found');

    await Promise.all(
      courses.map(async (course) => {
        // Update URLs for chapters' uploaded files
        const updatedChapters = await Promise.all(
          course.chapters.map(async (chapter) => {
            if (chapter.uploadedFiles && chapter.uploadedFiles.length > 0) {
              const updatedFiles = await Promise.all(
                chapter.uploadedFiles.map(async (file) => {
                  if (file.uniqueName) {
                    return { ...file, url: await generateSignedUrl(file.uniqueName) };
                  }
                  return file;
                })
              );
              return { ...chapter, uploadedFiles: updatedFiles };
            }
            return chapter;
          })
        );

        // Generate signed URLs for featuredImg and featuredVideo
        let featuredImgUrl = course.featuredImgUrl;
        let featuredVideoUrl = course.featuredVideoUrl;

        if (course.featuredImgName) {
          featuredImgUrl = await generateSignedUrl(course.featuredImgName);
        }
        if (course.featuredVideoName) {
          featuredVideoUrl = await generateSignedUrl(course.featuredVideoName);
        }

        // Update the course with new URLs
        await prisma.course.update({
          where: { id: course.id },
          data: {
            featuredImgUrl,
            featuredVideoUrl,
            chapters: {
              set: updatedChapters.map((chapter) => ({
                id: chapter.id,
                ...chapter,
              })),
            },
          },
        });
      })
    );

    // Update user avatars
    const users = await prisma.user.findMany({
      select: {
        id: true,
        avatarName: true,
        avatarUrl: true,
      },
    });

    if (!users?.length) return console.log('No users found');

    await Promise.all(
      users.map(async (user) => {
        let avatarUrl = user.avatarUrl;

        if (user.avatarName) {
          console.log('BEFORE', user.avatarUrl);
          avatarUrl = await generateSignedUrl(user.avatarName);
          console.log('AFTER', avatarUrl);
        }

        return prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl,
          },
        });
      })
    );

    console.log('Course URLs updated successfully');
  } catch (error) {
    console.log('Error updating course URLs:', error);
  }
};

const allStatistics = async () => {
  try {
    // Try to find the existing statistics document
    let statistics = await prisma.statistics.findFirst();

    if (!statistics) {
      statistics = await prisma.statistics.create({
        data: {}, // Create with default values
      });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Update the total number of users
    const totalUsers = await prisma.user.count();

    // Update the number of active users (logged in today)
    const activeUsers = await prisma.user.count({
      where: {
        AND: [
          { lastLogin: { gte: startOfDay } },
          { isActive: true },
        ],
      },
    });

    // Update the number of inactive users
    const inactiveUsers = await prisma.user.count({
      where: {
        OR: [
          { lastLogin: { lt: startOfDay } },
          { isActive: false },
        ],
      },
    });

    // Update churn rate
    const deletedUserCount = statistics.deletedUserCount || 0;
    const churnRate =
      totalUsers > 0
        ? ((deletedUserCount / (totalUsers + deletedUserCount)) * 100).toFixed(2)
        : 0;

    // Calculate course completion rate
    const users = await prisma.user.findMany({
      select: {
        userCourses: true,
      },
    });

    let totalCourses = 0;
    let completedCourses = 0;

    users.forEach((user) => {
      if (user.userCourses?.length) {
        totalCourses += user.userCourses.length;
        completedCourses += user.userCourses.filter(
          (course) => course.duration === 2
        ).length;
      }
    });

    const courseCompleted =
      totalCourses > 0
        ? ((completedCourses / totalCourses) * 100).toFixed(2)
        : 0;

    // Calculate user enrollment rate
    const usersEnrolledToday = await prisma.user.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    const enrollRate =
      totalUsers > 0
        ? ((usersEnrolledToday / totalUsers) * 100).toFixed(2)
        : 0;

    // Update review statistics
    const reviewCounts = await Promise.all([
      prisma.review.count({ where: { star: 1 } }),
      prisma.review.count({ where: { star: 2 } }),
      prisma.review.count({ where: { star: 3 } }),
      prisma.review.count({ where: { star: 4 } }),
      prisma.review.count({ where: { star: 5 } }),
    ]);

    // Update statistics
    statistics = await prisma.statistics.update({
      where: { id: statistics.id },
      data: {
        userStatsTotalUsers: totalUsers,
        userStatsActiveUsers: activeUsers,
        userStatsInactiveUsers: inactiveUsers,
        userStatsChurnRate: parseFloat(churnRate),
        userStatsCourseCompleted: parseFloat(courseCompleted),
        userStatsEnrollRate: parseFloat(enrollRate),
        reviewStatsTotal: reviewCounts.reduce((a, b) => a + b, 0),
        reviewStatsOne: reviewCounts[0],
        reviewStatsTwo: reviewCounts[1],
        reviewStatsThree: reviewCounts[2],
        reviewStatsFour: reviewCounts[3],
        reviewStatsFive: reviewCounts[4],
      },
    });

    console.log(statistics);
    return statistics;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw new Error('Failed to fetch statistics.');
  }
};

const updatePayoutDate = async () => {
  const today = new Date();

  if (today.getDate() === 1) {
    // Check if it’s the first day of the month
    const newDueDate = getLastDayOfNextMonth();

    try {
      await prisma.user.updateMany({
        data: {
          affiliateDueDate: newDueDate,
        },
      });
      console.log('Updated dueDate to the last day of the month.');
    } catch (error) {
      console.error('Error updating dueDate:', error);
    }
  }
};

const getLastDayOfNextMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month + 1, 0); // Last day of the next month
};