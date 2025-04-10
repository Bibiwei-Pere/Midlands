import express from "express";
const router = express.Router();
import {
  getAllCart,
  getCart,
  postCart,
  deleteCart,
} from "../controllers/cart.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllCart).post(postCart).delete(deleteCart);

router.route("/:cartId").get(getCart);

export default router;
