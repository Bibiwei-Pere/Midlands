import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SibApiV3Sdk from "sib-api-v3-sdk";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const { CLIENT_URL, BREVO_API_NAME, BREVO_API_KEY } = process.env;

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"]; // Correct key name for authentication
apiKey.apiKey = BREVO_API_KEY;
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const mailToSupport = async (req, res) => {
  const { fullName, email, title, description } = req.body;

  if (!fullName) return res.status(400).json({ message: "FullName field is required" });
  if (!title) return res.status(400).json({ message: "Title field is required" });
  if (!email) return res.status(400).json({ message: "Email field is required" });
  if (!description) return res.status(400).json({ message: "Description field is required" });

  try {
    const emailData1 = {
      to: [{ email }],
      sender: {
        name: "Lassod" || 'MyWebsite',
        email: "olanitori00@gmail.com",
      },
      subject: title,
      htmlContent: `
        <p>Hello <b>${fullName}</b>,</p>
        <p>We have received your response, and we will get back to you shortly</p>
<br/>
        <p>Thanks for contacting us</p>
      `,
    };
    await transactionalEmailsApi.sendTransacEmail(emailData1);

    const emailData2 = {
      to: [{ email: "support@mywebsite.com" }],
      sender: {
        name: "Lassod" || 'MyWebsite',
        email: "olanitori00@gmail.com",
      },
      subject: title,
      htmlContent: `
        <p>From <b>${fullName}</b>,</p>
        <p>Email <b>${email}</b>,</p>
<br/>
        <h2>${description}</h2>
<br/>

      `,
    };

    await transactionalEmailsApi.sendTransacEmail(emailData2);

    return res.status(200).json({
      message: `Message Sent`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password, confirmPassword, phone } = req.body;
  const { username: refUsername } = req.params;

  console.log(req.body);
  console.log(req.params);

  if (!password) {
    return res.status(400).json({ message: 'Password field is required' });
  }
  if (!username) {
    return res.status(400).json({ message: 'Username field is required' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email field is required' });
  }
  if (!phone) {
    return res.status(400).json({ message: 'Phone field is required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
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
      return res.status(400).json({ message: 'Email address already exists!' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);

    let userData = {
      username,
      email,
      password: hashedPwd,
      phone,
      verificationCode,
      otpExpiry,
      role: 'User',
    };

    if (refUsername) {
      const updatedRefUsername = refUsername.replace(/-/g, ' ');
      const refUser = await prisma.user.findFirst({
        where: { username: updatedRefUsername },
      });

      if (refUser) {
        userData.affiliateRefereeUserId = refUser.id
        userData.affiliateRefereeDate = new Date();

        await prisma.user.update({
          where: { id: refUser.id },
          data: {
            affiliateCount: { increment: 1 },
          },
        });
      }
    }

    console.log(userData);

    const user = await prisma.user.create({
      data: userData,
    });

    console.log('verificationCode', verificationCode);

    const emailData = {
      to: [{ email }],
      sender: {
        name: "Lassod" || 'MyWebsite',
        email: "olanitori00@gmail.com",
      },
      subject: 'Your Verification OTP Code',
      htmlContent: `
        <p>Hello <b>${username}</b>,</p>
        <p>Thank you for signing up. Use the OTP below to verify your account:</p>
        <h2>${verificationCode}</h2>
        <p>This OTP is valid for 1 hour.</p>
        <p>If you did not sign up, please ignore this email.</p>
      `,
    };

    await transactionalEmailsApi.sendTransacEmail(emailData);

    return res.status(200).json({
      email,
      password,
      message: `Registration successful! Check your email for the OTP to verify your account.`,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const signin = async (req, res) => {
  const { email, password, username, isGoogleSignIn } = req.body;
  console.log(req.body);

  if (!isGoogleSignIn && (!email || !password)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (isGoogleSignIn) {
      const socialUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!socialUser) {
        if (!username) {
          return res.status(400).json({ message: 'Username is required for Google Sign-In' });
        }
        await prisma.user.create({
          data: {
            username,
            email,
            isVerified: true,
          },
        });
      } else {
        await prisma.user.update({
          where: { email },
          data: { isVerified: true },
        });
      }
    }

    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid Email address' });
    }
    console.log('first');

    if (!isGoogleSignIn) {
      const isPasswordValid = await bcrypt.compare(password, foundUser.password || '');
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid Password' });
      }
    }
    console.log('second');

    if (!foundUser.isVerified) {
      return res.status(401).json({
        email,
        message: 'Your account is not verified yet, verify now',
      });
    }
    console.log('third');

    await prisma.user.update({
      where: { email },
      data: {
        lastLogin: new Date(),
        isActive: true,
      },
    });

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    await prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    console.log(foundUser);

    res.status(200).json({
      email,
      accessToken,
      refreshToken,
      role: foundUser.role,
      id: foundUser.id,
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Failed to Signin!' });
  } finally {
    await prisma.$disconnect();
  }
};

const generateAccessToken = (user) => {
  console.log("thirdfffffffff");

  console.log(user);

  return jwt.sign(
    {
      UserInfo: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" } // Access token expires in 15 minutes
  );
};

const generateRefreshToken = (user) => {
  console.log("refresh", user);
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Refresh token expires in 7 days
};

export const refreshToken = async (req, res) => {
  const { token } = req.params; // Expecting refresh token in the request body

  console.log("first");
  console.log(token);

  if (!token) return res.status(400).json({ message: "Refresh token required" });

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    console.log("second");

    // Generate a new access token
    const accessToken = generateAccessToken(user);
    console.log("third");

    res.status(200).json({ email: user.email, accessToken, refreshToken: token, role: user.role, id: user._id });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) return res.status(400).json({ message: "Email not found!" });

    // Generate the reset token
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "30m" });
    const resetLink = `${CLIENT_URL}/auth/new-password/${user.id}/${token}`;

    // Set up email datass
    const emailData = {
      to: [{ email: user.email }],
      sender: { name: "Lassod", email: "olanitori00@gmail.com" },
      subject: "Reset Your Password",
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
                              <h1 style="color:#1e1e2d; font-size:32px; font-family:'Rubik',sans-serif;">Reset your password</h1>
                              <p style="color:#455056; font-size:15px; line-height:24px;">
                                  To reset your password, click the following button. Link expires in <strong>30 minutes</strong>.
                              </p>
                              <a href="${resetLink}"
                                  style="background:#20e277; text-decoration:none; font-size:14px; padding:10px 24px; border-radius:50px; color:#fff;">
                                  Reset Password
                              </a>
                              <p style="color:#455056; font-size:15px; line-height:24px;">OR paste this link in your browser: ${resetLink}</p>
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
    };

    // Send the email
    await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log(`Password reset email sent to ${user.email}`);
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.error(`Error sending password reset email:`, error);
    res.status(500).json({ message: "Error sending email" });
  }
};



export const newPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password);
  console.log(confirmPassword);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  console.log('Reset Link clicked');

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_key', async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Error with token' });
      }

      try {
        const hashedPwd = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
          where: { id: parseInt(id) },
          data: { password: hashedPwd },
        });

        if (!updatedUser) {
          return res.status(400).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Success!' });
      } catch (updateError) {
        console.error('Update error:', updateError);
        res.status(400).json({ message: 'Error updating password' });
      }
    });
  } catch (error) {
    console.error('New password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: { refreshToken: null },
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(403).json({ message: 'Failed to log out' });
  }
};

// Generate 6-digit OTP and set expiration time


export const generateOtp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Account already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
    console.log(verificationCode);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode,
        otpExpiry,
      },
    });

    const emailData = {
      to: [{ email }],
      sender: {
        name: "Lassod" || 'MyWebsite',
        email: "olanitori00@gmail.com",
      },
      subject: 'Your Verification OTP Code',
      htmlContent: `
        <p>Hello <b>${user.username}</b>,</p>
        <p>Thank you for signing up. Use the OTP below to verify your account:</p>
        <h2>${verificationCode}</h2>
        <p>This OTP is valid for 1 hour.</p>
        <p>If you did not sign up, please ignore this email.</p>
      `,
    };

    await transactionalEmailsApi.sendTransacEmail(emailData);

    res.status(200).json({
      email,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, password, verificationCode } = req.body;
  console.log(req.body);
  try {
    const user = await prisma.user.findUnique({ where: { email: email, verificationCode: parseInt(verificationCode) } });
    if (!user || user.otpExpiry < Date.now()) return res.status(400).json({ message: "Invalid or expired OTP" });
    console.log(user);


    // user.verificationCode = null;
    // user.otpExpiry = null;
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true
      },
    });

    res.status(200).json({ email, password, message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Verification failed" });
  }
};

export const socialLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!password) return res.status(400).json({ message: "Password field is required" });
  if (!email) return res.status(400).json({ message: "Email field is required" });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log(user);

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    if (user) await signin({ body: { email, password } }, res);

    // res.status(200).json({ message: "Welcome to mywebsite" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server error" });
  }
};
