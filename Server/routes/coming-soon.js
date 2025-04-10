import express from "express";
const router = express.Router();
import { getAllComings, postComing } from "../controllers/coming-soon.js";

router.route("/").get(getAllComings).post(postComing);

export default router;
