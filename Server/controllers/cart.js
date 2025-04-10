import Cart from "../models/Cart.js";

export const getAllCart = async (_req, res) => {
  const cart = await Cart.find().lean();
  if (!cart?.length) return res.status(400).json({ message: "No cart found" });
  res.json(cart);
};

export const getCart = async (req, res) => {
  const { cartId } = req.params;
  console.log("first");
  const cart = await Cart.findById(cartId).lean();
  console.log(cart);
  if (!cart) return res.status(400).json({ message: "No cart found" });
  res.json(cart);
};

export const postCart = async (req, res) => {
  const { userId, category, title, amount, count } = req.body;

  if (!category)
    return res.status(400).json({ message: "Category field is required" });
  if (!title)
    return res.status(400).json({ message: "Title field is required" });
  if (!amount)
    return res.status(400).json({ message: "Amount field is required" });
  if (!userId)
    return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser)
    return res.status(400).json({ message: "CurrentUser not found" });

  try {
    const cart = await Cart.create({
      user: userId,
      category,
      title,
      amount: parseInt(amount),
      count: parseInt(count),
    });

    if (cart)
      return res
        .status(200)
        .json({ message: `${title} has been added to created` });
    else return res.status(400).json({ message: "Invalid cart data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCart = async (req, res) => {
  const { cartId } = req.body;
  console.log("req.body");
  console.log(req.body);
  if (!cartId) return res.status(400).json({ message: "Cart ID required" });

  const cart = await Cart.findById(cartId).exec();
  if (!cart) return res.status(400).json({ message: "Cart not found!" });

  await cart.deleteOne();
  res.json("Cart successfully deleted");
};
