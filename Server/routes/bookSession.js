import express from "express";
const router = express.Router();
import {
  getAllBookSession,
  getBookSession,
  postBookSession,
  deleteBookSession,
  updateBookSession,
} from "../controllers/bookSession.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllBookSession).post(postBookSession).patch(updateBookSession);

router.route("/:bookSessionId").get(getBookSession).delete(deleteBookSession);

export default router;
