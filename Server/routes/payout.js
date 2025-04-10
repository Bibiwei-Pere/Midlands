import express from "express";
const router = express.Router();
import {
  getAllPayout,
  getPayout,
  getUserPayouts,
  postPayout,
  deletePayout,
  updatePayout,
} from "../controllers/payout.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllPayout).post(postPayout).patch(updatePayout);

router.route("/user/:userId").get(getUserPayouts);
router.route("/:payoutId").get(getPayout);
router.route("/:payoutId").delete(deletePayout);

export default router;
