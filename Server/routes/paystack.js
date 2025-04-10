import express from "express";
const router = express.Router();
import { getBanks, postVerify, verifyAccountNumber } from "../controllers/paystack.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getBanks);
router.route("/verify").post(postVerify);
router.route("/verify/:account_number/:bank_code").post(verifyAccountNumber);

export default router;
