import User from "../models/User.js";
import Ticket from "../models/Tickets.js";
import { createNotification } from "./notification.js";

export const getAllTicket = async (_req, res) => {
  const ticket = await Ticket.find().sort({ createdAt: -1 }).lean();
  if (!ticket?.length) return res.status(400).json({ message: "No ticket found" });
  res.json(ticket);
};

export const getUserTickets = async (req, res) => {
  const { userId } = req.params;

  try {
    const ticket = await Ticket.find({ user: userId }).sort({ createdAt: -1 }).lean();
    if (!ticket || ticket.length === 0) return res.status(400).json({ message: "No ticket found for this user" });

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTicket = async (req, res) => {
  const { userId, ticketId, email, subject, category, description, status } = req.body;
  if (!ticketId) return res.status(400).json({ message: "ID field is required" });
  if (!userId) return res.status(400).json({ message: "User field is required" });

  const ticket = await Ticket.findById(ticketId).exec();
  if (!ticket) return res.status(400).json({ message: "Ticket not found!" });

  if (status) ticket.status = status;
  if (email) ticket.email = email;
  if (subject) ticket.subject = subject;
  if (category) ticket.category = category;
  if (description) ticket.description = description;

  await ticket.save();

  res.status(200).json(`Ticket has been successfully updated`);
};

export const postTicket = async (req, res) => {
  const { userId, email, subject, category, description } = req.body;

  if (!email) return res.status(400).json({ message: "Email field is required" });
  if (!subject) return res.status(400).json({ message: "Subject field is required" });
  if (!category) return res.status(400).json({ message: "Category field is required" });
  if (!description) return res.status(400).json({ message: "Description field is required" });
  if (!userId) return res.status(400).json({ message: "UserId field is required" });

  const currentUser = await User.findById(userId).exec();
  if (!currentUser) {
    console.log("first");
    return res.status(400).json({ message: "CurrentUser not found" });
  }

  try {
    const ticket = await Ticket.create({
      user: userId,
      email,
      subject,
      description,
      category,
    });

    await createNotification({
      id: userId,
      title: "Help & Support",
      text: "We have received your ticket on",
      product: `${subject}, you'll be contacted shortly.`,
    });

    if (ticket) return res.status(200).json({ message: `Ticket has been added to created` });
    else return res.status(400).json({ message: "Invalid ticket data received" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;
  if (!ticketId) return res.status(400).json({ message: "Ticket ID required" });

  const ticket = await Ticket.findById(ticketId).exec();
  if (!ticket) return res.status(400).json({ message: "Ticket not found!" });

  await ticket.deleteOne();
  res.json("Ticket successfully deleted");
};
