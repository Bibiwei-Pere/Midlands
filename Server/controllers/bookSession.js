import { createNotification } from "./notification.js";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); s

export const getAllBookSession = async (_req, res) => {
  try {
    const bookSessions = await prisma.bookSession.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (!bookSessions?.length) {
      return res.status(200).json([]);
    }

    const now = new Date();

    // Map sessions to add sessionStatus
    const sessionsWithStatus = bookSessions.map((session) => ({
      ...session,
      sessionStatus: session.bookSessionDate && new Date(session.bookSessionDate) < now ? 'Past' : 'Upcoming',
    }));

    res.json(sessionsWithStatus);
  } catch (error) {
    console.error('Get all book sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const getBookSession = async (req, res) => {
  const { bookSessionId } = req.params;
  const bookSession = await prisma.bookSession.findUnique({ where: { bookSessionId } });
  if (!bookSession) return res.status(400).json({ message: "No bookSession found" });
  res.json(bookSession);
};

export const postBookSession = async (req, res) => {
  const { userId, program, bookSession } = req.body;

  if (!program) return res.status(400).json({ message: "Program field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentUser) return res.status(400).json({ message: "CurrentUser not found" });

  try {
    const bookSessionData = await prisma.bookSession.create({
      data: {
        userId: userId,
        program: program,
        bookSessionDate: bookSession.bookSessionDate,
        bookSessionEmail: bookSession.bookSessionEmail,
        bookSessionName: bookSession.bookSessionName,
        bookSessionNumber: bookSession.bookSessionNumber
      }
    });

    if (bookSessionData) return res.status(200).json({ message: `Session has been booked successfully` });
    else return res.status(400).json({ message: "Invalid data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateBookSession = async (req, res) => {
  const { userId, bookSessionId, status, amount } = req.body;

  if (!bookSessionId) {
    return res.status(400).json({ message: 'ID field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'User field is required' });
  }

  try {
    const bookSession = await prisma.bookSession.findUnique({
      where: { id: parseInt(bookSessionId) },
    });

    if (!bookSession) {
      return res.status(400).json({ message: 'Book Session not found!' });
    }

    if (bookSession.status === 'Successful' || bookSession.status === 'Failed') {
      return res.status(400).json({ message: `You've already ${bookSession.status} this transaction` });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(400).json({ message: 'Current user not found' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { bookSessionId: parseInt(bookSession.id || '0') },
    });

    if (!transaction) {
      return res.status(400).json({ message: 'Transaction not found' });
    }

    const updates = {};
    if (status) {
      updates.status = status;
    }

    await prisma.$transaction(async (tx) => {
      if (Object.keys(updates).length) {
        await tx.bookSession.update({
          where: { id: parseInt(bookSessionId) },
          data: updates,
        });
      }

      if (status) {
        await tx.transaction.update({
          where: { bookingSessionId: parseInt(bookSession.id || '0') },
          data: { status },
        });
      }

      if (status === 'Successful') {
        await createNotification({
          id: parseInt(userId),
          title: 'Book Session',
          text: 'You have successfully purchased',
          product: bookSession.program,
        });
      } else if (status === 'Failed') {
        await createNotification({
          id: parseInt(userId),
          title: 'Book Session',
          text: 'Your transaction to purchase',
          product: `${bookSession.program} was unsuccessful`,
        });
      }
    });

    res.status(200).json('Booked Session has been successfully updated');
  } catch (error) {
    console.error('Update book session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const deleteBookSession = async (req, res) => {
  const { bookSessionId } = req.params;

  if (!bookSessionId) {
    return res.status(400).json({ message: 'BookSession ID required' });
  }

  try {
    const bookSession = await prisma.bookSession.findUnique({
      where: { id: parseInt(bookSessionId) },
    });

    if (!bookSession) {
      return res.status(400).json({ message: 'BookSession not found!' });
    }

    await prisma.bookSession.delete({
      where: { id: parseInt(bookSessionId) },
    });

    res.json({ message: 'BookSession successfully deleted' });
  } catch (error) {
    console.error('Delete book session error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};