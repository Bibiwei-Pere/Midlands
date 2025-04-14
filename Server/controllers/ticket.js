import { PrismaClient } from '@prisma/client';
import { createNotification } from './notification.js';

const prisma = new PrismaClient();

export const getAllTicket = async (_req, res) => {
  try {
    const tickets = await prisma.tickets.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!tickets?.length) {
      return res.status(400).json({ message: 'No ticket found' });
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserTickets = async (req, res) => {
  const { userId } = req.params;

  try {
    const tickets = await prisma.tickets.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    if (!tickets?.length) {
      return res.status(400).json({ message: 'No ticket found for this user' });
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTicket = async (req, res) => {
  const { userId, ticketId, email, subject, category, description, status } = req.body;

  if (!ticketId) {
    return res.status(400).json({ message: 'ID field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'User field is required' });
  }

  try {
    const ticket = await prisma.tickets.findUnique({
      where: { id: parseInt(ticketId) },
    });

    if (!ticket) {
      return res.status(400).json({ message: 'Ticket not found!' });
    }

    const updatedTicket = await prisma.tickets.update({
      where: { id: parseInt(ticketId) },
      data: {
        email: email || ticket.email,
        subject: subject || ticket.subject,
        category: category || ticket.category,
        description: description || ticket.description,
        status: status || ticket.status,
      },
    });

    res.status(200).json({ message: 'Ticket has been successfully updated' });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const postTicket = async (req, res) => {
  const { userId, email, subject, category, description } = req.body;

  // Validate input fields
  if (!email) {
    return res.status(400).json({ message: 'Email field is required' });
  }
  if (!subject) {
    return res.status(400).json({ message: 'Subject field is required' });
  }
  if (!category) {
    return res.status(400).json({ message: 'Category field is required' });
  }
  if (!description) {
    return res.status(400).json({ message: 'Description field is required' });
  }
  if (!userId) {
    return res.status(400).json({ message: 'UserId field is required' });
  }

  try {
    // Check if the current user exists
    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!currentUser) {
      return res.status(400).json({ message: 'CurrentUser not found' });
    }

    // Create a new ticket
    const ticket = await prisma.tickets.create({
      data: {
        userId: parseInt(userId),
        email,
        subject,
        description,
        category,
        status: 'Open', // Default from schema
      },
    });

    // Create notification (assuming this function is implemented elsewhere)
    await createNotification({
      id: userId,
      title: 'Help & Support',
      text: 'We have received your ticket on',
      product: `${subject}, you'll be contacted shortly.`,
    });

    return res.status(200).json({ message: 'Ticket has been added to created' });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  if (!ticketId) {
    return res.status(400).json({ message: 'Ticket ID required' });
  }

  try {
    const ticket = await prisma.tickets.findUnique({
      where: { id: parseInt(ticketId) },
    });

    if (!ticket) {
      return res.status(400).json({ message: 'Ticket not found!' });
    }

    await prisma.tickets.delete({
      where: { id: parseInt(ticketId) },
    });

    res.json({ message: 'Ticket successfully deleted' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Server error' });
  }
};