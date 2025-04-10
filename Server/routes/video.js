import express from "express";
const router = express.Router();
import {
  getVideoById,
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoByCategory,
} from "../controllers/video.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(createVideo)
  .patch(updateVideo)
  .delete(deleteVideo);

router.route("/:videoId").get(getVideoById);
router.route("/category/:name").get(getVideoByCategory);

export default router;
