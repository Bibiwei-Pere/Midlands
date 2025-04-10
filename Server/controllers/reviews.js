import Reviews from "../models/Reviews.js";
import User from "../models/User.js";

export const getAllReviews = async (_req, res) => {
  const reviews = await Reviews.find().lean();
  if (!reviews?.length) return res.status(200).json([]);
  res.json(reviews);
};

export const getReview = async (req, res) => {
  const { userId, courseId } = req.params;
  const review = await Reviews.findOne({ user: userId, courseId }).exec();
  if (!review) return res.status(400).json({ message: "No review found" });
  res.json(review);
};

export const getReviewByCourseId = async (req, res) => {
  const { courseId } = req.params;

  // Fetch reviews with .lean() to get plain objects
  const reviews = await Reviews.find({ courseId: courseId }).lean().exec();
  if (!reviews) return res.status(200).json([]);

  const reviewWithUser = await Promise.all(
    reviews.map(async (review) => {
      const user = await User.findById(review.user).lean().exec();
      return { ...review, user: user };
    })
  );

  res.json(reviewWithUser);
};

export const postReview = async (req, res) => {
  const { userId, courseId, instructorId, response, star } = req.body;
  console.log(req.body);
  // Validate input fields
  if (!courseId) return res.status(400).json({ message: "CourseId field is required" });
  if (!instructorId) return res.status(400).json({ message: "InstructorId field is required" });
  if (!response) return res.status(400).json({ message: "Response field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });
  if (!star) return res.status(400).json({ message: "Review field is required" });

  // Check if the current user exists
  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  try {
    // Check if the user has already reviewed this course
    const existingReview = await Reviews.findOne({ user: userId, courseId }).exec();
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this course." });

    const instructor = await User.findById(instructorId).exec();
    if (!instructor) return res.status(400).json({ message: "Instructor not found" });

    instructor.reviews += 1;

    // Create a new review
    const review = await Reviews.create({
      user: userId,
      courseId,
      instructorId,
      response,
      star: star,
    });

    if (review) {
      console.log(instructor);
      await instructor.save();
      return res.status(200).json({ message: "Thanks for dropping a review" });
    } else {
      return res.status(400).json({ message: "Invalid reviews data received" });
    }
  } catch (error) {
    console.error("Error posting review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId, response, star } = req.body;

  if (!reviewId) return res.status(400).json({ message: "Review field is required" });

  const review = await Reviews.findById(reviewId).exec();
  if (!review) return res.status(400).json({ message: "Review not found!" });

  if (response) review.response = response;
  if (star) review.star = star;

  await review.save();

  res.json({ message: "Review has been successfully updated" });
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  if (!reviewId) return res.status(400).json({ message: "Review ID required" });

  const review = await Reviews.findById(reviewId).exec();
  if (!review) return res.status(400).json({ message: "Review not found!" });

  await review.deleteOne();
  res.json("Review successfully deleted");
};
