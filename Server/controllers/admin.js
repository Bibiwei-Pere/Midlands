import User from "../models/User.js";
import Course from "../models/Course.js";
import Transaction from "../models/Transaction.js";
import Certificate from "../models/Certificate.js";
import bcrypt from "bcrypt";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersStatistics = async (_req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Active users: logged in today and marked active
    const activeUsers = await prisma.user.count({
      where: {
        lastLogin: { gte: startOfDay },
        isActive: true,
      },
    });

    // Inactive users: haven't logged in today or marked inactive
    const inactiveUsers = await prisma.user.count({
      where: {
        OR: [
          { lastLogin: { lt: startOfDay } },
          { isActive: false },
        ],
      },
    });

    res.json({
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        phone: true,
        username: true,
        email: true,
        roles: true,
        lastLogin: true,
        isActive: true,
        bankAccountName: true,
        bankAccountNumber: true,
        bankName: true,
        bankRecipientCode: true,
        affiliateCommissionRate: true,
        affiliateBalance: true,
        affiliateCount: true,
        affiliateConversion: true,
        affiliateLifetimeEarnings: true,
        affiliateWithdrawalCount: true,
        affiliateDueDate: true,
        affiliateRefereeUserId: true,
        affiliateRefereeDate: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!users?.length) {
      return res.status(400).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user, excluding password
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        phone: true,
        username: true,
        email: true,
        roles: true,
        lastLogin: true,
        isActive: true,
        bankAccountName: true,
        bankAccountNumber: true,
        bankName: true,
        bankRecipientCode: true,
        affiliateCommissionRate: true,
        affiliateBalance: true,
        affiliateCount: true,
        affiliateConversion: true,
        affiliateLifetimeEarnings: true,
        affiliateWithdrawalCount: true,
        affiliateDueDate: true,
        affiliateRefereeUserId: true,
        affiliateRefereeDate: true,
        courses: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      include: {
        course: true,
        transactions: {
          orderBy: { createdAt: 'desc' }
        },
        certificates: {
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }


    // fetch all active and paid courses
    const activeCourseList = await prisma.userCourse.findMany({
      where: { userId: parseInt(userId) },
    });

    const paidCourse = activeCourseList.map(async (m) => {
      const p = await prisma.transaction.findMany({
        where: { userId: parseInt(userId), courseId: m.courseId }
      });
      return p;
    });


    // Fetch transactions and certificates
    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    const certificates = await prisma.certificate.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      ...user,
      activeCourseList,
      paidCourse,
      transactions,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createNewUser = async (req, res) => {
  const {
    firstname,
    lastname,
    phone,
    username,
    email,
    roles,
    password,
    confirmPassword,
  } = req.body;

  // Validation
  if (!username) {
    return res.status(400).json({ message: 'Username field is required' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email field is required' });
  }
  if (!password) {
    return res.status(400).json({ message: 'Password field is required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check for duplicates (case-insensitive)
    const duplicateUsername = await prisma.user.findFirst({
      where: {
        username: { equals: username, mode: 'insensitive' },
      },
    });
    if (duplicateUsername) {
      return res.status(400).json({ message: 'Duplicate username' });
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
      },
    });
    if (duplicateEmail) {
      return res.status(400).json({ message: 'Email address already exist!' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Prepare user data
    const userObject = {
      firstname,
      lastname,
      phone,
      username,
      email,
      password: hashedPwd,
      ...(Array.isArray(roles) && roles.length ? { roles } : {}),
    };

    // Create user
    const user = await prisma.user.create({
      data: userObject,
    });

    res.status(200).json({ message: `New user ${username} created` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const {
    userId,
    firstname,
    lastname,
    phone,
    username,
    email,
    password,
    about,
    skills,
    avatarName,
    avatarFileId,
    avatarUrl,
    bankAccountName,
    bankAccountNumber,
    bankName,
    bankRecipientCode,
    affiliateCommissionRate,
    notificationsRemindersEmail,
    notificationsRemindersSms,
    notificationsUpdatesEmail,
    notificationsUpdatesSms,
    notificationsOthersEmail,
    notificationsOthersSms,
    isVerified,
    courseToAdd,
    courseToRemove,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {

    const result = await prisma.$transaction(async (prisma) => {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare update data
      const updateData = {};

      // Basic info
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (phone !== undefined) updateData.phone = phone;
      if (about !== undefined) updateData.about = about;
      if (skills !== undefined) updateData.skills = skills;

      // Authentication fields
      if (username !== undefined) {
        const duplicateUsername = await prisma.user.findFirst({
          where: {
            username: { equals: username, mode: 'insensitive' },
            NOT: { id: parseInt(userId) }
          }
        });
        if (duplicateUsername) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        updateData.username = username;
      }

      if (email !== undefined) {
        const duplicateEmail = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: 'insensitive' },
            NOT: { id: parseInt(userId) }
          }
        });
        if (duplicateEmail) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        updateData.email = email;
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Avatar fields
      if (avatarName !== undefined) updateData.avatarName = avatarName;
      if (avatarFileId !== undefined) updateData.avatarFileId = avatarFileId;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

      // Bank details
      if (bankAccountName !== undefined) updateData.bankAccountName = bankAccountName;
      if (bankAccountNumber !== undefined) updateData.bankAccountNumber = bankAccountNumber;
      if (bankName !== undefined) updateData.bankName = bankName;
      if (bankRecipientCode !== undefined) updateData.bankRecipientCode = bankRecipientCode;

      // Affiliate info
      if (affiliateCommissionRate !== undefined) updateData.affiliateCommissionRate = affiliateCommissionRate;

      // Notification preferences
      if (notificationsRemindersEmail !== undefined) updateData.notificationsRemindersEmail = notificationsRemindersEmail;
      if (notificationsRemindersSms !== undefined) updateData.notificationsRemindersSms = notificationsRemindersSms;
      if (notificationsUpdatesEmail !== undefined) updateData.notificationsUpdatesEmail = notificationsUpdatesEmail;
      if (notificationsUpdatesSms !== undefined) updateData.notificationsUpdatesSms = notificationsUpdatesSms;
      if (notificationsOthersEmail !== undefined) updateData.notificationsOthersEmail = notificationsOthersEmail;
      if (notificationsOthersSms !== undefined) updateData.notificationsOthersSms = notificationsOthersSms;

      // Verification
      if (isVerified !== undefined) updateData.isVerified = isVerified;
      if (courseToAdd) {
        const courseExists = await prisma.course.findUnique({
          where: { id: courseToAdd }
        });
        if (!courseExists) throw new Error('Course to add does not exist');

        await prisma.userCourse.upsert({
          where: {
            userId_courseId: {
              userId: parseInt(req.body.userId),
              courseId: courseToAdd
            }
          },
          update: {},
          create: {
            userId: parseInt(req.body.userId),
            courseId: courseToAdd
          }
        });
      }

      if (courseToRemove) {
        await prisma.userCourse.delete({
          where: {
            userId_courseId: {
              userId: parseInt(req.body.userId),
              courseId: courseToRemove
            }
          }
        });
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: updateData,
      });
      return updatedUser
    });

    res.json({ message: `${result.username} successfully updated` });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User ID required' });
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: { userId: parseInt(id) },
    });

    if (transaction) {
      return res
        .status(400)
        .json({ message: "User has transactions, can't delete" });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json('User successfully deleted');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
