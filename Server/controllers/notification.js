import { PrismaClient } from '@prisma/client';
import SibApiV3Sdk from 'sib-api-v3-sdk';

const prisma = new PrismaClient();

const { CLIENT_URL, BREVO_API_NAME, BREVO_API_KEY } = process.env;

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = BREVO_API_KEY;
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const getAllNotifications = async (req, res) => {
  try {
    const notes = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (!notes?.length) {
      return res.status(400).json({ message: 'No notifications found' });
    }

    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await prisma.user.findUnique({
          where: { id: note.userId },
          select: { username: true },
        });
        return { ...note, username: user?.username || 'Unknown' };
      })
    );

    res.json(notesWithUser);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const getAllUserNotifications = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const notes = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });

    if (!notes?.length) {
      return res.status(400).json({ message: 'No notifications found for this user' });
    }

    res.json(notes);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Failed to fetch user notifications' });
  }
};

export const createNotification = async ({ id, title, text, product }) => {
  if (!title) throw new Error('Title field is required');
  if (!text) throw new Error('Text field is required');

  if (!id) {
    // Notify all users
    const users = await prisma.user.findMany();

    const createdNotes = await Promise.all(
      users.map(async (user) => {
        return prisma.notification.create({
          data: {
            userId: user.id,
            title,
            text,
            product,
          },
        });
      })
    );

    return createdNotes.length > 0
      ? 'New notes created for all users'
      : 'Failed to create notes for users';
  } else {
    // Notify a specific user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const note = await prisma.notification.create({
      data: {
        userId: parseInt(id),
        title,
        text,
        product,
      },
    });

    // Send email if user has email notifications enabled
    if (user.notificationsUpdatesEmail) {
      const emailData = {
        to: [{ email: user.email }],
        sender: { name: BREVO_API_NAME, email: 'noreply@mywebsite.com' },
        subject: title,
        htmlContent: `
          <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="font-family: 'Open Sans', sans-serif;">
                <tr><td style="height:80px;"> </td></tr>
                <tr><td style="text-align:center;"></td></tr>
                <tr><td style="height:20px;"> </td></tr>
                <tr>
                    <td>
                        <table width="95%" align="center" cellpadding="0" cellspacing="0"
                            style="background:#fff; border-radius:3px; text-align:center; box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr><td style="height:40px;"> </td></tr>
                            <tr><td style="padding:0 35px;">
                                <h1 style="color:#1e1e2d; font-size:32px; font-family:'Rubik',sans-serif;">${title}</h1>
                                <p style="color:#455056; font-size:15px; line-height:24px;">Hello <b>${user.username}</b>,</p>
                                <p style="color:#455056; font-size:15px; line-height:24px;">${text}:</p>
                                <p style="color:#455056; font-size:15px; line-height:24px;"> <b>${product}</b> </p>
                                <a href="${CLIENT_URL}/dashboard"
                                    style="background:#20e277; text-decoration:none; font-size:14px; padding:10px 24px; border-radius:50px; color:#fff;">
                                    Open Dashboard
                                </a>
                            </td></tr>
                            <tr><td style="height:40px;"> </td></tr>
                        </table>
                    </td>
                </tr>
                <tr><td style="text-align:center;">
                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.74);">© ${CLIENT_URL}</p>
                </td></tr>
                <tr><td style="height:80px;"> </td></tr>
            </table>
          </body>
        `,
      };

      await transactionalEmailsApi.sendTransacEmail(emailData);
    }

    return `New notification created for ${user.username}`;
  }
};

export const postNotification = async (req, res) => {
  const { id, title, text, product } = req.body;
  console.log(req.body);

  if (!title) {
    return res.status(400).json({ message: 'Title field is required' });
  }
  if (!text) {
    return res.status(400).json({ message: 'Text field is required' });
  }

  try {
    if (!id) {
      // Notify all users
      const users = await prisma.user.findMany();

      const createdNotes = await Promise.all(
        users.map(async (user) => {
          return prisma.notification.create({
            data: {
              userId: user.id,
              title,
              text,
              product,
            },
          });
        })
      );

      if (createdNotes.length > 0) {
        return res.status(200).json({ message: 'New note created for all users' });
      } else {
        return res.status(400).json({ message: 'Failed to create note for all users' });
      }
    } else {
      // Notify a specific user
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const note = await prisma.notification.create({
        data: {
          userId: parseInt(id),
          title,
          text,
          product,
        },
      });

      return res.status(200).json({ message: `New notification created for ${user.username}` });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification' });
  }
};

export const updateNotification = async (req, res) => {
  const { id, user, title, text, isRead } = req.body;

  try {
    const note = await prisma.notification.findUnique({
      where: { id: parseInt(id) },
    });

    if (!note) {
      return res.status(400).json({ message: 'Note not found' });
    }

    const updatedNote = await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        userId: user ? parseInt(user) : undefined,
        title: title || undefined,
        text: text || undefined,
        isRead: isRead !== undefined ? isRead : undefined,
      },
    });

    res.json(`'${updatedNote.title}' updated`);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      const result = await prisma.notification.deleteMany({});

      if (result.count > 0) {
        return res.json('All notifications deleted');
      } else {
        return res.status(400).json({ message: 'No notifications found to delete' });
      }
    } else {
      const notification = await prisma.notification.findUnique({
        where: { id: parseInt(id) },
      });

      if (!notification) {
        return res.status(400).json({ message: 'Notification not found' });
      }

      await prisma.notification.delete({
        where: { id: parseInt(id) },
      });

      res.json(`Notification with ID ${id} deleted`);
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};