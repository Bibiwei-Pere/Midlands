import express from "express";
const router = express.Router();
import { getAllTicket, updateTicket, postTicket, deleteTicket } from "../controllers/ticket.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllTicket).patch(updateTicket).post(postTicket);
router.route("/:ticketId").delete(deleteTicket);

export default router;
