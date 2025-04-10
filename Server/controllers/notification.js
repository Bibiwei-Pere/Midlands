import User from "../models/User.js";
import Notification from "../models/Notification.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

const { CLIENT_URL, BREVO_API_NAME, BREVO_API_KEY } = process.env;

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"]; // Correct key name for authentication
apiKey.apiKey = BREVO_API_KEY;
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const getAllNotifications = async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 }).lean();

  if (!notes?.length) return res.status(400).json({ message: "No notifications found" });

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  res.json(notesWithUser);
};

export const getAllUserNotifications = async (req, res) => {
  const { userId } = req.params;
  console.log("first", userId);
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const notes = await Notification.find({ user: userId }).sort({ createdAt: -1 }).lean();
  console.log(notes);
  if (!notes?.length) return res.status(400).json({ message: "No notifications found for this user" });

  res.json(notes);
};

// export const getNotification = async (req, res) => {
//   const { notificationId } = req.params;

//   const notes = await Notification.findById(notificationId).lean();

//   if (!notes)
//     return res.status(400).json({ message: "No notifications found" });

//   res.json(notes);
// };

// Create a separate helper function for notifications

export const createNotification = async ({ id, title, text, product }) => {
  if (!title) throw new Error("Title field is required");
  if (!text) throw new Error("Text field is required");

  if (!id) {
    const users = await User.find().lean().exec();
    const notePromises = users.map(async (user) => {
      const note = await Notification.create({
        user: user._id,
        title,
        text,
        product,
      });
      return note.save();
    });

    const createdNotes = await Promise.all(notePromises);
    return createdNotes.length > 0 ? "New notes created for all users" : "Failed to create notes for users";
  } else {
    // Create a notification for a specific user
    const user = await User.findById(id).exec();
    if (!user) throw new Error("User not found");

    const note = await Notification.create({ user: id, title, text, product });
    if (note) {
      await note.save();

      // if(user?.notifications?.updates.email)
      const emailData = {
        to: [{ email: user.email }],
        sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
        subject: title,
        htmlContent: `
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="font-family: 'Open Sans', sans-serif;">
              <tr><td style="height:80px;">&nbsp;</td></tr>
              <tr><td style="text-align:center;"></td></tr>
              <tr><td style="height:20px;">&nbsp;</td></tr>
              <tr>
                  <td>
                      <table width="95%" align="center" cellpadding="0" cellspacing="0"
                          style="background:#fff; border-radius:3px; text-align:center; box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                          <tr><td style="height:40px;">&nbsp;</td></tr>
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
                          <tr><td style="height:40px;">&nbsp;</td></tr>
                      </table>
                  </td>
              </tr>
              <tr><td style="text-align:center;">
                  <p style="font-size:14px; color:rgba(69, 80, 86, 0.74);">&copy; ${CLIENT_URL}</p>
              </td></tr>
              <tr><td style="height:80px;">&nbsp;</td></tr>
          </table>
        </body>
      `,
        //   htmlContent: `
        //   <p>Hello <b>${user.username}</b>,</p>
        //   <p>${text}:</p>
        //   <b>${product}</b>
        // `,
      };

      await transactionalEmailsApi.sendTransacEmail(emailData);

      return `New notification created for ${user.username}`;
    } else {
      throw new Error("Invalid notification data received");
    }
  }
};

export const postNotification = async (req, res) => {
  const { id, title, text, product } = req.body;
  console.log(req.body);
  if (!title) return res.status(400).json({ message: "Title field is required" });
  if (!text) return res.status(400).json({ message: "Text field is required" });

  if (!id) {
    const users = await User.find().lean().exec();

    // Create and store the new note for each user
    const notePromises = users.map(async (user) => {
      const note = await Notification.create({
        user: user._id,
        title,
        text,
        product,
      });
      await note.save();
    });

    const createdNotes = await Promise.all(notePromises);

    if (createdNotes.length > 0) return res.status(200).json({ message: "New note created for all users" });
    else return res.status(400).json({ message: "Failed to create note for all users" });
  } else {
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: "User not found" });

    const note = await Notification.create({ user: id, title, text, product });

    if (note) {
      await note.save();
      console.log(note);
      return res.status(200).json({ message: `New notification created for ${user.username}` });
    } else return res.status(400).json({ message: "Invalid note data received" });
  }
};

export const updateNotification = async (req, res) => {
  const { id, user, title, text, isRead } = req.body;
  console.log(req.body);
  const note = await Notification.findById(id).exec();
  if (!note) return res.status(400).json({ message: "Note not found" });

  if (user) note.user = user;
  if (title) note.title = title;
  if (text) note.text = text;
  if (isRead) note.isRead = isRead;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  // Confirm data
  if (!id) {
    const result = await Notification.deleteMany({});

    if (result.deletedCount > 0) res.json(`All notifications deleted`);
    else res.status(400).json({ message: "No notifications found to delete" });
  } else {
    const notification = await Notification.findById(id).exec();
    if (!notification) return res.status(400).json({ message: "Notification not found" });

    await notification.deleteOne();
    res.json(`Notification with ID ${id} deleted`);
  }
};

const title = ["Course Completed", "Successful transaction", "New course", "New quiz", "Certificate"];
