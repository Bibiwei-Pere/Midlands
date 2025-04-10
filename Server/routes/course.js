import express from "express";
const router = express.Router();
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getUserCourses,
  getCourse,
  getAllCoursesAdmin,
} from "../controllers/course.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllCourses).post(createCourse).patch(updateCourse);

router.route("/admin/v1/all").get(getAllCoursesAdmin);
router.route("/:userId").get(getUserCourses);
router.route("/:courseId").delete(deleteCourse);
router.route("/single/:courseId").get(getCourse);

export default router;
