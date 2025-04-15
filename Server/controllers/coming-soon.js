import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllComings = async (_req, res) => {
  try {
    const comings = await prisma.coming.findMany();

    if (!comings?.length) {
      return res.status(200).json([]);
    }

    res.json(comings);
  } catch (error) {
    console.error('Get all coming soon error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const postComing = async (req, res) => {
  const { email, phone, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email field is required' });
  }

  try {
    const duplicateEmail = await prisma.coming.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
    });

    if (duplicateEmail) {
      return res.status(400).json({ message: 'Email address already exist!' });
    }

    const data = await prisma.coming.create({
      data: {
        email,
        phone,
        name,
      },
    });

    if (data) {
      return res.status(200).json({ message: 'Your email address has been saved, thanks' });
    } else {
      return res.status(400).json({ message: 'Invalid coming soon data received' });
    }
  } catch (error) {
    console.error('Post coming soon error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};