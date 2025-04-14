import { PrismaClient } from '@prisma/client';
import { postTransaction } from './transaction.js';
import { createNotification } from './notification.js';
import { initializePayout } from './paystack.js';

const prisma = new PrismaClient();

export const getAllPayout = async (_req, res) => {
  try {
    const payouts = await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!payouts?.length) {
      return res.status(400).json({ message: 'No payout found' });
    }

    res.json(payouts);
  } catch (error) {
    console.error('Error fetching payouts:', error);
    res.status(500).json({ message: 'Failed to fetch payouts' });
  }
};

export const getUserPayouts = async (req, res) => {
  const { userId } = req.params;

  try {
    const payouts = await prisma.payout.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    if (!payouts?.length) {
      return res.status(400).json({ message: 'No payout found' });
    }

    res.json(payouts);
  } catch (error) {
    console.error('Error fetching user payouts:', error);
    res.status(500).json({ message: 'Failed to fetch user payouts' });
  }
};

export const getPayout = async (req, res) => {
  const { payoutId } = req.params;

  try {
    const payout = await prisma.payout.findUnique({
      where: { id: parseInt(payoutId) },
    });

    if (!payout) {
      return res.status(400).json({ message: 'No payout found' });
    }

    res.json(payout);
  } catch (error) {
    console.error('Error fetching payout:', error);
    res.status(500).json({ message: 'Failed to fetch payout' });
  }
};

export const postPayout = async (req, res) => {
  const { userId, amount } = req.body;

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

    if (currentUser.affiliateBalance < parseInt(amount)) {
      return res.status(400).json({ message: 'Insufficient fund!' });
    }

    // Ensure payout can only be requested after or on the due date
    const today = new Date();
    const dueDate = new Date(currentUser.affiliateDueDate);
    if (today < dueDate) {
      return res.status(400).json({
        message: `Payouts can only be requested on your due date: ${dueDate.toLocaleDateString()}`,
      });
    }

    let updatedRequest = {
      userId,
      product: 'Withdrawal',
      transactionType: 'Affiliate Payout',
      amount: parseInt(amount),
      reference: 'Payout',
    };

    // Call postTransaction (assumes it’s adapted for Prisma or works as-is)
    await postTransaction({ body: updatedRequest }, res);

    const payout = await prisma.payout.create({
      data: {
        userId: parseInt(userId),
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        amount: parseFloat(amount),
        bankAccountName: currentUser.bankAccountName,
        bankAccountNumber: currentUser.bankAccountNumber,
        bankName: currentUser.bankName,
      },
    });

    await createNotification({
      id: userId,
      title: 'Affiliate Payout',
      text: 'We are currently processing your',
      product: `affiliate payout request of ₦${amount}`,
    });

    return res.status(200).json({
      message: `You withdrawal is being processed. You'll be notified shortly.`,
    });
  } catch (error) {
    console.error('Error creating payout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePayout = async (req, res) => {
  const { userId, payoutId, status, amount } = req.body;

  // Validate inputs
  if (!payoutId) {
    return res.status(400).json({ message: 'ID field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'User field is required' });
  }

  try {
    // Find payout by ID
    const payout = await prisma.payout.findUnique({
      where: { id: parseInt(payoutId) },
    });

    if (!payout) {
      return res.status(400).json({ message: 'Payout not found!' });
    }

    // Check if the payout has already been approved or rejected
    if (payout.status === 'Approved' || payout.status === 'Rejected') {
      return res.status(400).json({
        message: `You've already ${payout.status} this transaction`,
      });
    }

    // Find the current user by ID
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(400).json({ message: 'Current user not found' });
    }

    // Check if the user has sufficient funds
    if (currentUser.affiliateBalance < parseFloat(amount)) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Prepare user and payout updates
    let userUpdate = {};
    if (status === 'Approved') {
      userUpdate = {
        affiliateBalance: currentUser.affiliateBalance - parseFloat(amount),
        affiliateWithdrawalCount: currentUser.affiliateWithdrawalCount + parseInt(amount),
      };
    }

    // Update payout status
    const updatedPayout = await prisma.payout.update({
      where: { id: parseInt(payoutId) },
      data: {
        status: status || payout.status,
      },
    });

    // Update user if needed
    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: userUpdate,
      });
    }

    // Create notifications based on the payout status
    if (status === 'Approved') {
      const payutStatus = await initializePayout(amount, currentUser.bankRecipientCode);

      if (payutStatus.status) {
        await createNotification({
          id: userId,
          title: 'Affiliate Payout',
          text: 'We have successfully confirmed your',
          product: `affiliate payout request of ₦${amount}`,
        });
      }
    } else if (status === 'Rejected') {
      await createNotification({
        id: userId,
        title: 'Affiliate Payout',
        text: 'Your',
        product: `affiliate payout request of ₦${amount} was rejected`,
      });
    }

    // Send success response
    res.status(200).json('Payout has been successfully updated');
  } catch (error) {
    console.error('Error updating payout:', error);
    res.status(500).json({ message: 'Failed to update payout' });
  }
};

export const deletePayout = async (req, res) => {
  const { payoutId } = req.params;

  if (!payoutId) {
    return res.status(400).json({ message: 'Payout ID required' });
  }

  try {
    const payout = await prisma.payout.findUnique({
      where: { id: parseInt(payoutId) },
    });

    if (!payout) {
      return res.status(400).json({ message: 'Payout not found!' });
    }

    await prisma.payout.delete({
      where: { id: parseInt(payoutId) },
    });

    res.json('Payout successfully deleted');
  } catch (error) {
    console.error('Error deleting payout:', error);
    res.status(500).json({ message: 'Failed to delete payout' });
  }
};