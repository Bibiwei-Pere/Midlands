import Category from "../models/Category.js";
import Video from "../models/Video.js";

export const getAllCategory = async (_req, res) => {
  const category = await Category.find().select("-password").lean();
  if (!category?.length)
    return res.status(400).json({ message: "No category found" });
  res.json(category);
};

export const getCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log("first");
  const category = await Category.findById(categoryId)
    .select("-password")
    .lean();
  console.log(category);
  if (!category) return res.status(400).json({ message: "No category found" });
  res.json(category);
};

export const createNewCategory = async (req, res) => {
  const { name } = req.body;
  console.log(name);
  if (!name) return res.status(400).json({ message: "Name field is required" });

  const duplicateName = await Category.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicateName)
    return res.status(400).json({ message: "Duplicate category name" });

  try {
    const category = await Category.create({ name });

    if (category)
      return res.status(200).json({ message: `New category ${name} created` });
    else
      return res
        .status(400)
        .json({ message: "Invalid category data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId, name } = req.body;
  console.log(req.body);

  if (!categoryId)
    return res.status(400).json({ message: "ID field is required" });

  const category = await Category.findById(categoryId).exec();
  if (!category) return res.status(400).json({ message: "Category not found" });

  const oldName = category.name;

  if (name) {
    const duplicateName = await Category.findOne({ name })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (duplicateName)
      return res.status(400).json({ message: "Duplicate name" });
    else category.name = name;
  }

  const updateCategory = await category.save();

  // If title was changed, update related videos
  if (oldName !== category.name)
    await Video.updateMany({ category: oldName }, { category: category.name });

  res.json({ message: `${updateCategory.name} successfully updated` });
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  console.log("req.body");
  console.log(req.body);
  if (!categoryId)
    return res.status(400).json({ message: "Category ID required" });

  const category = await Category.findById(categoryId).exec();
  if (!category)
    return res.status(400).json({ message: "Category not found!" });

  await category.deleteOne();
  res.json("Category successfully deleted");
};
