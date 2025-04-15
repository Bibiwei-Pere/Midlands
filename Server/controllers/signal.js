import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSignals = async (_req, res) => {
  try {
    const signals = await prisma.signal.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!signals?.length) {
      return res.status(200).json([]);
    }

    const signalsWithUser = await Promise.all(
      signals.map(async (signal) => {
        const user = await prisma.user.findUnique({
          where: { id: signal.userId },
          select: { username: true },
        });
        return { ...signal, username: user?.username || 'Unknown' };
      })
    );

    res.json(signalsWithUser);
  } catch (error) {
    console.error('Error fetching signals:', error);
    res.status(500).json({ message: 'Failed to fetch signals' });
  }
};

export const getUserSignals = async (req, res) => {
  const { userId } = req.params;

  try {
    const signals = await prisma.signal.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(signals.length ? signals : []);
  } catch (error) {
    console.error('Error fetching user signals:', error);
    res.status(500).json({ message: 'Failed to fetch user signals' });
  }
};

export const getSignal = async (req, res) => {
  const { signalId } = req.params;

  try {
    const signal = await prisma.signal.findUnique({
      where: { id: parseInt(signalId) },
    });

    if (!signal) {
      return res.status(400).json({ message: 'No signal found' });
    }

    res.json(signal);
  } catch (error) {
    console.error('Error fetching signal:', error);
    res.status(500).json({ message: 'Failed to fetch signal' });
  }
};

export const postSignal = async (req, res) => {
  const { userId, currency, orderType, stopLoss, price, profit1, profit2, profit3, duration, info, isDraft } = req.body;

  // Validate required fields
  if (!currency) {
    return res.status(400).json({ message: 'currency field is required' });
  }
  if (!price) {
    return res.status(400).json({ message: 'price field is required' });
  }
  if (!stopLoss) {
    return res.status(400).json({ message: 'Stop loss field is required' });
  }

  try {
    if (isDraft !== 'Draft') {
      // Create signals for all users
      const users = await prisma.user.findMany();

      const phoneNumbers = [];
      const signals = await Promise.all(
        users.map(async (user) => {
          const signal = await prisma.signal.create({
            data: {
              userId: user.id,
              currency,
              stopLoss,
              price,
              orderType: orderType || 'BUY',
              profit1,
              profit2,
              profit3,
              duration,
              info,
              isDraft: null,
            },
          });

          if (user.phone) {
            phoneNumbers.push(user.phone);
          }

          return signal;
        })
      );

      if (signals.length > 0) {
        return res.status(200).json({ message: 'New signal created and SMS sent to all users' });
      } else {
        return res.status(400).json({ message: 'Failed to create signal for all users' });
      }
    } else {
      // Create a draft signal for a specific user
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const signal = await prisma.signal.create({
        data: {
          userId: parseInt(userId),
          currency,
          stopLoss,
          price,
          orderType: orderType || 'BUY',
          profit1,
          profit2,
          profit3,
          duration,
          info,
          isDraft,
        },
      });

      return res.status(200).json({ message: 'New signal draft added' });
    }
  } catch (error) {
    console.error('Error creating signal:', error);
    res.status(500).json({ message: 'Failed to create signal' });
  }
};

export const updateSignal = async (req, res) => {
  const {
    signalId,
    currency,
    stopLoss,
    isDraft,
    orderType,
    price,
    profit1,
    profit2,
    profit3,
    info,
    isRead,
    duration,
  } = req.body;

  try {
    const signal = await prisma.signal.findUnique({
      where: { id: parseInt(signalId) },
    });

    if (!signal) {
      return res.status(400).json({ message: 'Signal not found' });
    }

    if (isDraft === 'Undraft') {
      // Create signals for all users
      const users = await prisma.user.findMany();

      const phoneNumbers = [];
      const signals = await Promise.all(
        users.map(async (user) => {
          const newSignal = await prisma.signal.create({
            data: {
              userId: user.id,
              currency: currency || signal.currency,
              stopLoss: stopLoss || signal.stopLoss,
              price: price || signal.price,
              orderType: orderType || signal.orderType,
              profit1: profit1 || signal.profit1,
              profit2: profit2 || signal.profit2,
              profit3: profit3 || signal.profit3,
              duration: duration || signal.duration,
              info: info || signal.info,
              isDraft: null,
            },
          });

          if (user.phone) {
            phoneNumbers.push(user.phone);
          }

          return newSignal;
        })
      );

      if (signals.length > 0) {
        // Optionally delete the original draft signal
        await prisma.signal.delete({
          where: { id: parseInt(signalId) },
        });
        return res.status(200).json({ message: 'New signal created and SMS sent to all users' });
      } else {
        return res.status(400).json({ message: 'Failed to create signal for all users' });
      }
    }

    // Update the existing signal
    const updatedSignal = await prisma.signal.update({
      where: { id: parseInt(signalId) },
      data: {
        currency: currency || signal.currency,
        stopLoss: stopLoss || signal.stopLoss,
        price: price || signal.price,
        orderType: orderType || signal.orderType,
        profit1: profit1 || signal.profit1,
        profit2: profit2 || signal.profit2,
        profit3: profit3 || signal.profit3,
        duration: duration || signal.duration,
        info: info || signal.info,
        isRead: isRead !== undefined ? isRead : signal.isRead,
        isDraft: isDraft || signal.isDraft,
      },
    });

    console.log(updatedSignal);
    res.json('Signal successfully updated');
  } catch (error) {
    console.error('Error updating signal:', error);
    res.status(500).json({ message: 'Failed to update signal' });
  }
};

export const deleteSignal = async (req, res) => {
  const { signalId } = req.params;

  try {
    const signal = await prisma.signal.findUnique({
      where: { id: parseInt(signalId) },
    });

    if (!signal) {
      return res.status(400).json({ message: 'Signal not found' });
    }

    await prisma.signal.delete({
      where: { id: parseInt(signalId) },
    });

    res.json('Signal deleted successfully');
  } catch (error) {
    console.error('Error deleting signal:', error);
    res.status(500).json({ message: 'Failed to delete signal' });
  }
};