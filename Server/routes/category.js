import express from "express";
const router = express.Router();
import {
  getAllCategory,
  getCategory,
  createNewCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router
  .route("/")
  .get(getAllCategory)
  .post(createNewCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

router.route("/:categoryId").get(getCategory);

export default router;
