// controllers/certificateController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCertificate = async (_req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      include: { user: true },
    });

    if (!certificates?.length) {
      return res.status(200).json([]);
    }

    res.json(certificates);
  } catch (error) {
    console.error('Get all certificates error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserCertificates = async (req, res) => {
  const { userId } = req.params;

  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (!certificates?.length) {
      return res.status(200).json([]);
    }

    res.json(certificates);
  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const postCertificate = async (req, res) => {
  const { userId, category, title, courseId, size } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Category field is required' });
  }
  if (!title) {
    return res.status(400).json({ message: 'Title field is required' });
  }
  if (!courseId) {
    return res.status(400).json({ message: 'courseId field is required' });
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

    const certificate = await prisma.certificate.create({
      data: {
        userId: parseInt(userId),
        category,
        title,
        courseId,
        size: size ? parseInt(size) : 4,
      },
    });

    if (certificate) {
      return res.status(200).json({ message: 'Download will begin shortly' });
    } else {
      return res.status(400).json({ message: 'Invalid certificate data received' });
    }
  } catch (error) {
    console.error('Post certificate error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCertificate = async (req, res) => {
  const { certificateId } = req.body;
  console.log('req.body', req.body);

  if (!certificateId) {
    return res.status(400).json({ message: 'Certificate ID required' });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(certificateId) },
    });

    if (!certificate) {
      return res.status(400).json({ message: 'Certificate not found!' });
    }

    await prisma.certificate.delete({
      where: { id: parseInt(certificateId) },
    });

    res.json('Certificate successfully deleted');
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};