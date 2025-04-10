import express from "express";
const router = express.Router();
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getStatistics,
  getSaleStatistics,
  getUsersStatistics,
  getCourseStatistics,
  getLeaderBoardStats,
  getTeacherCourseStats,
  getTopEarningCourses,
  getTeacherCourseStatsById,
} from "../controllers/statistics.js";

router.use(verifyJWT);

router.route("/").get(getStatistics);
router.route("/course").get(getCourseStatistics);
router.route("/users").get(getUsersStatistics);
router.route("/sale").get(getSaleStatistics);
router.route("/teacher").get(getTeacherCourseStats);
router.route("/teacher/:userId").get(getTeacherCourseStatsById);
router.route("/leaderboard").get(getLeaderBoardStats);
router.route("/earners").get(getTopEarningCourses);

export default router;
