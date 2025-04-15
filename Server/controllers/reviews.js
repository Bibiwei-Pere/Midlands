import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllReviews = async (_req, res) => {
  try {
    const reviews = await prisma.review.findMany();

    res.status(200).json(reviews.length ? reviews : []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const getReview = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const review = await prisma.review.findFirst({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
      },
    });

    if (!review) {
      return res.status(400).json({ message: 'No review found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Failed to fetch review' });
  }
};

export const getReviewByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const reviews = await prisma.review.findMany({
      where: { courseId: parseInt(courseId) },
    });

    if (!reviews.length) {
      return res.status(200).json([]);
    }

    const reviewWithUser = await Promise.all(
      reviews.map(async (review) => {
        const user = await prisma.user.findUnique({
          where: { id: review.userId },
          select: {
            id: true,
            username: true,
            email: true,
          },
        });
        return { ...review, user: user || {} };
      })
    );

    res.json(reviewWithUser);
  } catch (error) {
    console.error('Error fetching reviews by course:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

export const postReview = async (req, res) => {
  const { userId, courseId, instructorId, response, star } = req.body;
  console.log(req.body);

  // Validate input fields
  if (!courseId) {
    return res.status(400).json({ message: 'CourseId field is required' });
  }
  if (!instructorId) {
    return res.status(400).json({ message: 'InstructorId field is required' });
  }
  if (!response) {
    return res.status(400).json({ message: 'Response field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'UserId field is required' });
  }
  if (!star) {
    return res.status(400).json({ message: 'Review field is required' });
  }

  try {
    // Check if the current user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(400).json({ message: 'CurrentUser not found' });
    }

    // Check if the user has already reviewed this course
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
      },
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course.' });
    }

    // Check if the instructor exists
    const instructor = await prisma.user.findUnique({
      where: { id: parseInt(instructorId) },
    });

    if (!instructor) {
      return res.status(400).json({ message: 'Instructor not found' });
    }

    // Create a new review
    const review = await prisma.review.create({
      data: {
        userId: parseInt(userId),
        courseId: parseInt(courseId),
        instructorId: parseInt(instructorId),
        response,
        star: parseInt(star),
      },
    });

    // Update instructor's review count
    await prisma.user.update({
      where: { id: parseInt(instructorId) },
      data: {
        reviews: instructor.reviews + 1,
      },
    });

    return res.status(200).json({ message: 'Thanks for dropping a review' });
  } catch (error) {
    console.error('Error posting review:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateReview = async (req, res) => {
  const { reviewId, response, star } = req.body;

  if (!reviewId) {
    return res.status(400).json({ message: 'Review field is required' });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) },
    });

    if (!review) {
      return res.status(400).json({ message: 'Review not found!' });
    }

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: {
        response: response || review.response,
        star: star ? parseInt(star) : review.star,
      },
    });

    res.json({ message: 'Review has been successfully updated' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res.status(400).json({ message: 'Review ID required' });
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) },
    });

    if (!review) {
      return res.status(400).json({ message: 'Review not found!' });
    }

    await prisma.review.delete({
      where: { id: parseInt(reviewId) },
    });

    res.json('Review successfully deleted');
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};