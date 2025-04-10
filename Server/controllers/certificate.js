import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

export const getAllCertificate = async (_req, res) => {
  const certificate = await Certificate.find().lean();
  if (!certificate?.length) return res.status(400).json({ message: "No certificate found" });
  res.json(certificate);
};

export const getUserCertificates = async (req, res) => {
  const { userId } = req.params;
  const certificate = await Certificate.find({ user: userId }).sort({ createdAt: -1 }).lean();

  if (!certificate) return res.status(400).json({ message: "No certificate found" });
  res.json(certificate);
};

export const postCertificate = async (req, res) => {
  const { userId, category, title, size, courseId } = req.body;

  if (!category) return res.status(400).json({ message: "Category field is required" });
  if (!title) return res.status(400).json({ message: "Title field is required" });
  if (!courseId) return res.status(400).json({ message: "courseId field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  try {
    const certificate = await Certificate.create({
      user: userId,
      category,
      courseId,
      title,
      size: parseInt(size),
    });

    if (certificate) return res.status(200).json({ message: `Download will begin shortly` });
    else return res.status(400).json({ message: "Invalid certificate data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCertificate = async (req, res) => {
  const { certificateId } = req.body;
  console.log("req.body");
  console.log(req.body);
  if (!certificateId) return res.status(400).json({ message: "Certificate ID required" });

  const certificate = await Certificate.findById(certificateId).exec();
  if (!certificate) return res.status(400).json({ message: "Certificate not found!" });

  await certificate.deleteOne();
  res.json("Certificate successfully deleted");
};
