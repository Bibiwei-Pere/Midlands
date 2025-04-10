import Course from "../models/Course.js";
import User from "../models/User.js";
import Statistics from "../models/Statistics.js";
import Reviews from "../models/Reviews.js";
import { generateSignedUrl } from "./fileUpload.js";

export const cron = async () => {
  await updateActiveCourses();
  await updateFiles();
  await allStatistics();
  await updatePayoutDate();
};

const updateActiveCourses = async () => {
  try {
    // Find all users (excluding sensitive data like password)
    const users = await User.find().select("-password").lean();
    if (!users?.length) return console.log("No users found");

    // Filter users who have active courses
    const usersWithActiveCourses = users.filter(
      (user) => Array.isArray(user.activeCourseList) && user.activeCourseList.length > 0
    );

    // Loop through users with active courses
    for (const user of usersWithActiveCourses) {
      const updates = [];

      // Loop through the user's activeCourseList
      user.activeCourseList.forEach((course) => {
        if (course.duration > 1) {
          // Prepare a partial update only for the duration field
          updates.push({
            updateOne: {
              filter: { _id: user._id, "activeCourseList.courseId": course.courseId },
              update: { $set: { "activeCourseList.$.duration": course.duration - 1 } },
            },
          });
        } else {
          // If duration is less than or equal to 1, remove the course from the list
          updates.push({
            updateOne: {
              filter: { _id: user._id },
              update: { $pull: { activeCourseList: { courseId: course.courseId } } },
            },
          });
        }
      });

      // Apply all updates at once for the user
      if (updates.length > 0) {
        await User.bulkWrite(updates);
      }
    }

    console.log("Active courses updated successfully");
  } catch (error) {
    console.log("Error updating active courses:", error);
  }
};

const updateFiles = async () => {
  try {
    // Find all courses (assuming no need to filter by user in this case)
    const courses = await Course.find().lean();
    if (!courses?.length) return console.log("No courses found");

    await Promise.all(
      courses.map(async (course) => {
        // Check if chapters exist before processing
        if (course.chapters && course.chapters.length > 0) {
          await Promise.all(
            course.chapters.map(async (chapter) => {
              // Check if uploadedFiles exist in each chapter
              if (chapter.uploadedFiles && chapter.uploadedFiles.length > 0) {
                await Promise.all(
                  chapter.uploadedFiles.map(async (file) => {
                    if (file.uniqueName) {
                      file.url = await generateSignedUrl(file.uniqueName);
                    }
                  })
                );
              }
            })
          );
        }

        // Generate signed URLs for featuredImg and featuredVideo if they exist
        if (course.featuredImg && course.featuredImg.name) {
          course.featuredImg.url = await generateSignedUrl(course.featuredImg.name);
        }
        if (course.featuredVideo && course.featuredVideo.name) {
          course.featuredVideo.url = await generateSignedUrl(course.featuredVideo.name);
        }

        // Update the course with new URLs
        return Course.updateOne(
          { _id: course._id },
          {
            $set: {
              featuredImg: course.featuredImg,
              featuredVideo: course.featuredVideo,
              chapters: course.chapters,
            },
          }
        );
      })
    );

    const users = await User.find().lean();
    if (!users?.length) return console.log("No users found");
    await Promise.all(
      users.map(async (user) => {
        if (user.avatar && user.avatar.name) {
          console.log("BEFOREDFDS", user.avatar);
          user.avatar.url = await generateSignedUrl(user.avatar.name);
          console.log("AFTERJHJKJ", user.avatar);
        }

        return User.updateOne(
          { _id: user._id },
          {
            $set: {
              avatar: user.avatar,
            },
          }
        );
      })
    );

    console.log("Course URLs updated successfully");
  } catch (error) {
    console.log("Error updating course URLs:", error);
  }
};

const allStatistics = async () => {
  try {
    // Try to find the existing statistics document
    let statistics = await Statistics.findOne();

    if (!statistics) {
      statistics = new Statistics();
    } else {
      // statistics.deleteOne()
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Update the total number of users
      statistics.userStats.totalUsers = await User.countDocuments().exec();

      // Update the number of active users (logged in today)
      statistics.userStats.activeUsers = await User.countDocuments({
        lastLogin: { $gte: startOfDay },
        isActive: true,
      }).exec();

      // Update the number of inactive users (either not logged in today or marked as inactive)
      statistics.userStats.inactiveUsers = await User.countDocuments({
        $or: [{ lastLogin: { $lt: startOfDay } }, { isActive: false }],
      }).exec();

      statistics.userStats.userChunRate =
        statistics.userStats.totalUsers > 0
          ? (
              (statistics.deletedUserCount / (statistics.userStats.totalUsers + statistics.deletedUserCount)) *
              100
            ).toFixed(2) // Convert to percentage
          : 0;

      const users = await User.find().exec();
      let totalCourses = 0;
      let completedCourses = 0;

      users.forEach((user) => {
        if (user.activeCourseList.length) {
          totalCourses += user.activeCourseList.length; // Total courses for all users
          // Count courses where `duration` is 2 (considered completed)
          completedCourses += user.activeCourseList.filter((course) => course.duration === 2).length;
        }
      });

      // Calculate course completion rate as a percentage
      statistics.userStats.courseCompleted =
        totalCourses > 0
          ? ((completedCourses / totalCourses) * 100).toFixed(2) // Convert to percentage
          : 0;

      // Calculate user enrollment rate
      const usersEnrolledToday = await User.countDocuments({
        createdAt: { $gte: startOfDay },
      }).exec();

      statistics.userStats.userEnrollRate =
        statistics.userStats.totalUsers > 0
          ? ((usersEnrolledToday / statistics.userStats.totalUsers) * 100).toFixed(2) // Convert to percentage
          : 0;

      // REVIEWS
      // Update the total number of users
      const reviewCounts = await Promise.all([
        Reviews.countDocuments({ star: 1 }).exec(),
        Reviews.countDocuments({ star: 2 }).exec(),
        Reviews.countDocuments({ star: 3 }).exec(),
        Reviews.countDocuments({ star: 4 }).exec(),
        Reviews.countDocuments({ star: 5 }).exec(),
      ]);

      // Update reviewStats in statistics
      statistics.reviewStats.total = reviewCounts.reduce((a, b) => a + b, 0); // Total reviews
      statistics.reviewStats.one = reviewCounts[0]; // Star 1 count
      statistics.reviewStats.two = reviewCounts[1]; // Star 2 count
      statistics.reviewStats.three = reviewCounts[2]; // Star 3 count
      statistics.reviewStats.four = reviewCounts[3]; // Star 4 count
      statistics.reviewStats.five = reviewCounts[4]; // Star 5 count
    }

    console.log(statistics);
    await statistics.save(); // Save the updated statistics document

    return statistics;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw new Error("Failed to fetch statistics.");
  }
};

const updatePayoutDate = async () => {
  const today = new Date();

  if (today.getDate() === 1) {
    // Check if it’s the first day of the month
    const newDueDate = getLastDayOfMonth();

    try {
      await User.updateMany({}, { "affiliate.dueDate": newDueDate });
      console.log("Updated dueDate to the last day of the month.");
    } catch (error) {
      console.error("Error updating dueDate:", error);
    }
  }
};

const getLastDayOfNextMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month + 1, 0); // Last day of the next month
};
