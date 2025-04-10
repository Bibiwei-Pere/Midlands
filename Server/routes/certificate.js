import express from "express";
const router = express.Router();
import {
  getAllCertificate,
  getUserCertificates,
  postCertificate,
  deleteCertificate,
} from "../controllers/certificate.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router.route("/").get(getAllCertificate).post(postCertificate).delete(deleteCertificate);

router.route("/:userId").get(getUserCertificates);

export default router;
