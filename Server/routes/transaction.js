import express from "express";
const router = express.Router();
import {
  getAllTransaction,
  postTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.js";
import verifyJWT from "../middleware/verifyJWT.js";
router.use(verifyJWT);

router
  .route("/")
  .get(getAllTransaction)
  .post(postTransaction)
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
