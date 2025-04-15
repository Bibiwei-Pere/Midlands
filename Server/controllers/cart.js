import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCart = async (_req, res) => {
  try {
    const carts = await prisma.cart.findMany({
      include: { user: true },
    });

    if (!carts?.length) {
      return res.status(200).json([]);
    }

    res.json(carts);
  } catch (error) {
    console.error('Get all carts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCart = async (req, res) => {
  const { cartId } = req.params;
  console.log('first');

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(cartId) },
      include: { user: true },
    });

    console.log(cart);
    if (!cart) {
      return res.status(400).json({ message: 'No cart found' });
    }

    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const postCart = async (req, res) => {
  const { userId, category, title, amount, count } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Category field is required' });
  }
  if (!title) {
    return res.status(400).json({ message: 'Title field is required' });
  }
  if (!amount) {
    return res.status(400).json({ message: 'Amount field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'UserId field is required' });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(400).json({ message: 'CurrentUser not found' });
    }

    const cart = await prisma.cart.create({
      data: {
        userId: parseInt(userId),
        category,
        title,
        amount: parseFloat(amount),
        count: count ? parseInt(count) : 1,
      },
    });

    if (cart) {
      return res.status(200).json({ message: `${title} has been added to cart` });
    } else {
      return res.status(400).json({ message: 'Invalid cart data received' });
    }
  } catch (error) {
    console.error('Post cart error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCart = async (req, res) => {
  const { cartId } = req.body;
  console.log('req.body', req.body);

  if (!cartId) {
    return res.status(400).json({ message: 'Cart ID required' });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(cartId) },
    });

    if (!cart) {
      return res.status(400).json({ message: 'Cart not found!' });
    }

    await prisma.cart.delete({
      where: { id: parseInt(cartId) },
    });

    res.json('Cart successfully deleted');
  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};