import User from "../models/User.js";
import Course from "../models/Course.js";

export const getAllCoursesAdmin = async (_req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 }).lean(); // Assuming 'createdAt' is the date field

  if (!courses?.length) return res.status(200).json([]);

  // Add username to each course before sending the response
  const cousreWithUser = await Promise.all(
    courses.map(async (course) => {
      const user = await User.findById(course.user).lean().exec();
      return { ...course, username: user.username };
    })
  );

  res.json(cousreWithUser);
};

export const getAllCourses = async (req, res) => {
  try {
    const { category, searchQuery, durationHours, minRatings, maxPrice } = req.query;

    console.log(req.query);
    // Build filter object based on provided query parameters
    const filters = {
      status: "Published",
    };

    if (category) filters.category = category;
    if (durationHours) filters.durationHours = { $lte: parseInt(durationHours) };
    if (minRatings) filters["ratings.average"] = { $gte: parseInt(minRatings) };
    if (maxPrice) filters.price = { $lte: parseInt(maxPrice) };
    if (searchQuery) {
      filters.title = { $regex: searchQuery, $options: "i" }; // 'i' for case-insensitive search
    }
    console.log("Filters", filters);
    const courses = await Course.find(filters).sort({ createdAt: -1 }).lean();
    // console.log(courses);
    if (!courses?.length) return res.status(200).json([]);

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCoursesLanding = async (req, res) => {
  try {
    const filters = {
      status: "Published",
    };

    console.log("Filters", filters);
    const courses = await Course.find(filters).lean();
    // console.log(courses);
    if (!courses?.length) return res.status(200).json([]);

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserCourses = async (req, res) => {
  const { userId } = req.params;
  const courses = await Course.find({ user: userId }).sort({ createdAt: -1 }).lean(); // Assuming 'createdAt' is the date field

  if (!courses?.length) return res.status(400).json({ message: "No course found" });
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).lean();
  if (!course) return res.status(400).json({ message: "No course found" });
  res.json(course);
};

export const createCourse = async (req, res) => {
  const {
    userId,
    category,
    title,
    name,
    featuredImg,
    featuredVideo,
    description,
    price,
    instructor,
    chapters,
    certificate,
    commission,
    status,
    miniDescription,
    durationHours,
    selectedCourseIds,
  } = req.body;

  if (!title) return res.status(400).json({ message: "Title field is required" });

  const user = await User.findById(userId).exec();
  if (!user) return res.status(400).json({ message: "User not found" });

  const course = await Course.create({
    user: userId,
    category,
    title,
    name,
    featuredImg,
    featuredVideo,
    description,
    certificate,
    price: parseInt(price),
    instructor,
    chapters,
    commission,
    status,
    miniDescription,
    selectedCourseIds,
    durationHours: parseInt(durationHours),
  });

  if (course) {
    await course.save();

    return res.status(200).json({ message: "New course created successfully" });
  } else {
    return res.status(400).json({ message: "Invalid course data received" });
  }
};

export const updateCourse = async (req, res) => {
  const {
    userId,
    courseId,
    category,
    title,
    name,
    featuredImg,
    featuredVideo,
    certificate,
    description,
    price,
    instructor,
    chapters,
    commission,
    status,
    miniDescription,
    durationHours,
    selectedCourseIds,
  } = req.body;
  console.log(req.body);

  if (!courseId) return res.status(400).json({ message: "ID field is required" });
  if (!userId) return res.status(400).json({ message: "User field is required" });
  if (!durationHours) return res.status(400).json({ message: "Duration field is required" });

  const course = await Course.findById(courseId).exec();
  if (!course) return res.status(400).json({ message: "Course not found!" });

  // Update simple fields
  if (category) course.category = category;
  if (title) course.title = title;
  if (description) course.description = description;
  if (price) course.price = parseInt(price);
  if (durationHours) course.durationHours = parseInt(durationHours);
  if (name) course.name = name;
  if (featuredImg) course.featuredImg = featuredImg;
  if (featuredVideo) course.featuredVideo = featuredVideo;
  if (instructor) course.instructor = instructor;
  if (commission) course.commission = commission;
  if (certificate) course.certificate = certificate;
  if (status) course.status = status;
  if (miniDescription) course.miniDescription = miniDescription;
  if (selectedCourseIds) course.selectedCourseIds = selectedCourseIds;

  // Update chapters
  if (chapters) {
    // Create a map for existing chapters using their `_id` values as keys
    const existingChaptersMap = new Map(course.chapters.map((chapter) => [chapter._id.toString(), chapter]));

    // Create an array to hold the updated chapters
    const updatedChapters = [];

    for (const chapter of chapters) {
      if (chapter._id) {
        // If the chapter has an _id, check if it exists in the course
        const existingChapter = existingChaptersMap.get(chapter._id.toString());
        if (existingChapter) {
          // Update fields of the existing chapter
          existingChapter.details = chapter.details || existingChapter.details;
          existingChapter.uploadedFiles = chapter.uploadedFiles || existingChapter.uploadedFiles;
          existingChapter.quiz = chapter.quiz || existingChapter.quiz;
          updatedChapters.push(existingChapter);
        } else {
          // If it doesn't exist, treat it as a new chapter
          updatedChapters.push(chapter);
        }
      } else {
        // If the chapter has no `_id`, treat it as a new chapter
        updatedChapters.push(chapter);
      }
    }

    // Replace the course's chapters with the updated array
    course.chapters = updatedChapters;
  }

  // Save the updated course
  await course.save();

  res.json(`Course has been successfully updated`);
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).exec();
  if (!course) return res.status(400).json({ message: "Course not found" });

  await course.deleteOne();
  res.json(`Course successfully deleted`);
};
