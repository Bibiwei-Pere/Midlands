import express from "express";
const router = express.Router();
import {
  getAllSignals,
  postSignal,
  updateSignal,
  deleteSignal,
  getSignal,
  getUserSignals,
} from "../controllers/signal.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllSignals).post(postSignal).patch(updateSignal);

router.route("/user/:userId").get(getUserSignals);
router.route("/:signalId").get(getSignal);
router.route("/:signalId").delete(deleteSignal);

export default router;
