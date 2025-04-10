import express from "express";
const router = express.Router();
import {
  getAllNotifications,
  // getNotification,
  postNotification,
  updateNotification,
  deleteNotification,
  getAllUserNotifications,
} from "../controllers/notification.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllNotifications).post(postNotification).patch(updateNotification);

router.route("/:userId").get(getAllUserNotifications);
router.route("/:id").delete(deleteNotification);

export default router;
