import express from "express";
const router = express.Router();
import {
  getAllReviews,
  getReview,
  postReview,
  deleteReview,
  updateReview,
  getReviewByCourseId,
} from "../controllers/reviews.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllReviews).post(postReview).patch(updateReview);

router.route("/:userId/:courseId").get(getReview);
router.route("/:courseId").get(getReviewByCourseId);
router.route("/:reviewId").delete(deleteReview);

export default router;
