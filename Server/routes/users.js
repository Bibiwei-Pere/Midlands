import express from "express";
const router = express.Router();
import * as users from "../controllers/users.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(users.getAllUsers).post(users.postUser).patch(users.updateUser);

router.route("/:userId/affiliate").get(users.getUserAffiliateChart);
router.route("/:userId").get(users.getUser);
router.route("/:userId").delete(users.deleteUser);
// router.route("/:userId").delete(users.deleteUser);

export default router;
