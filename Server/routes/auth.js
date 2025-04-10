import express from "express";
const router = express.Router();
import {
  signin,
  signup,
  resetPassword,
  verifyEmail,
  generateOtp,
  newPassword,
  socialLogin,
  refreshToken,
  mailToSupport,
} from "../controllers/auth.js";
import loginLimiter from "../middleware/loginLimiter.js";
import { getAllCoursesLanding } from "../controllers/course.js";

router.route("/signup").post(signup);
router.route("/signup/:username").post(signup);
router.route("/login").post(loginLimiter, signin);
router.route("/reset-password").post(resetPassword);
router.route("/new-password/:id/:token").post(newPassword);
router.route("/verify-email").post(verifyEmail);
router.route("/generateOtp").post(generateOtp); // Changed to POST
router.route("/social-login").post(socialLogin);
router.route("/contact-us").post(mailToSupport);
router.post("/refresh-token/:token", refreshToken);
router.route("/courses").get(getAllCoursesLanding);

export default router;
