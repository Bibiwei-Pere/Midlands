import express from "express";
import Multer from "multer";
import { deleteFileFromB2, regenerateSignedUrl, uploadFileToB2 } from "../controllers/fileUpload.js";

const router = express.Router();

// Configure Multer to store files in memory
const storage = new Multer.memoryStorage();
const uploads = Multer({ storage });

// Middleware to handle file uploads
const handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    // Call the Backblaze service to upload the file
    const result = await uploadFileToB2(req.file);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Your file has been uploaded successfully!",
        data: result,
      });
    } else res.status(500).json({ success: false, message: result.error });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.route("/").post(uploads.single("file"), handleUpload);
router.route("/").delete(deleteFileFromB2);
router.route("/:fileName").get(regenerateSignedUrl);

export default router;
