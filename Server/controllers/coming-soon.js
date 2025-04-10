import coming from "../models/coming-soon.js";

export const getAllComings = async (_req, res) => {
  const comcomings = await coming.find().select("-password").lean();
  if (!comcomings?.length) return res.status(400).json({ message: "No emails found" });

  res.json(comcomings);
};

export const postComing = async (req, res) => {
  const { email, phone, name } = req.body;
  if (!email) return res.status(400).json({ message: "Email field is required" });

  const duplicateEmail = await coming.findOne({ email }).collation({ locale: "en", strength: 2 }).lean().exec();
  if (duplicateEmail) return res.status(400).json({ message: "Email address already exist!" });

  const data = await coming.create({ email, phone, name });

  if (data) return res.status(200).json({ message: `Your email address has been saved, thanks` });
  else return res.status(400).json({ message: "Invalid comcoming data received" });
};
