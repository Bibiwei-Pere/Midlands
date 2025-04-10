import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SibApiV3Sdk from "sib-api-v3-sdk";

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
      sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
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
      sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
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
  if (!password) return res.status(400).json({ message: "Password field is required" });
  if (!username) return res.status(400).json({ message: "Username field is required" });
  if (!email) return res.status(400).json({ message: "Email field is required" });
  if (!phone) return res.status(400).json({ message: "Phone field is required" });
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  // Check for duplicates
  const duplicateUsername = await User.findOne({ username }).collation({ locale: "en", strength: 2 });
  if (duplicateUsername) return res.status(400).json({ message: "Duplicate username" });

  const duplicateEmail = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
  if (duplicateEmail) return res.status(400).json({ message: "Email address already exists!" });

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Generate OTP and expiration
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = Date.now() + 60 * 60 * 1000; // Expires in 1 hour

    // Create new user object with OTP and OTP expiry
    const user = new User({
      username,
      email,
      password: hashedPwd,
      verificationCode,
      otpExpiry,
      phone,
    });

    if (refUsername) {
      updatedRefUsername = refUsername.replace(/-/g, " ");
      const refUser = await User.findOne({ username: updatedRefUsername }).exec(); // Updated to findOne

      if (refUser) {
        user.affiliate.referee.userId = refUser._id;
        user.affiliate.referee.date = new Date();

        refUser.affiliate.count += 1;
        await refUser.save();
      }
    }

    console.log(user);

    await user.save();

    console.log("verificationCode", verificationCode);
    // Send OTP email
    const emailData = {
      to: [{ email }],
      sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
      subject: "Your Verification OTP Code",
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
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signin = async (req, res) => {
  const { email, password, username, isGoogleSignIn } = req.body;
  console.log(req.body);

  if (!isGoogleSignIn) if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    // CHECK IF THE USER EXISTS
    if (isGoogleSignIn) {
      const socialUser = await User.findOne({ email }).exec();
      if (!socialUser) {
        const user = new User({
          username,
          email,
          isVerified: true,
        });
        console.log(user);

        await user.save();
      } else {
        socialUser.isVerified = true;
        await socialUser.save();
      }
      // console.log(socialUser);
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.status(400).json({ message: "Invalid Email address" });
    console.log("first");

    // CHECK IF THE PASSWORD IS CORRECT
    if (!isGoogleSignIn) {
      const isPasswordValid = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordValid) return res.status(400).json({ message: "Invalid Password" });
    }
    console.log("second");

    if (!foundUser.isVerified)
      return res.status(401).json({
        email,
        password,
        message: "Your account is not verified yet, verify now",
      });

    console.log("third");

    // Update the lastLogin field
    foundUser.lastLogin = new Date();
    foundUser.isActive = true; // Mark the foundUser as active upon login
    await foundUser.save();
    const role = foundUser.role;

    // Generate tokens
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    // Save the refresh token in the user document
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    console.log(foundUser);
    res.status(200).json({ email, accessToken, refreshToken, role, id: foundUser._id, password });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Signin!" });
  }
};

const generateAccessToken = (user) => {
  console.log("thirdfffffffff");

  return jwt.sign(
    {
      UserInfo: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" } // Access token expires in 15 minutes
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Refresh token expires in 7 days
};

export const refreshToken = async (req, res) => {
  const { token } = req.params; // Expecting refresh token in the request body

  console.log("first");
  console.log(token);

  if (!token) return res.status(400).json({ message: "Refresh token required" });

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found!" });

    // Generate the reset token
    const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "30m" });
    const resetLink = `${CLIENT_URL}/auth/new-password/${user._id}/${token}`;

    // Set up email data
    const emailData = {
      to: [{ email: user.email }],
      sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
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

export const newPassword = (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password);
  console.log(confirmPassword);
  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

  console.log("Reset Link clicked");
  jwt.verify(token, "jwt_secret_key", async (err) => {
    if (err) return res.json({ Status: "Error with token" });
    else {
      const hashedPwd = await bcrypt.hash(password, 10);
      User.findByIdAndUpdate({ _id: id }, { password: hashedPwd })
        .then((u) => res.status(200).json({ message: "Success!" }))
        .catch((err) => res.status(400).json({ message: "Error!" }));
    }
  });
};

export const logout = async (req, res) => {
  const { token } = req.body; // Refresh token from request body

  if (!token) return res.status(400).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(403).json({ message: "User not found" });

    // Remove the refresh token from the user's refreshTokens array
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(403).json({ message: "Failed to log out" });
  }
};

// Generate 6-digit OTP and set expiration time
export const generateOtp = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists and is unverified
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

  // Generate OTP and set expiration
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const otpExpiry = Date.now() + 60 * 60 * 1000; // Expires in 1 hour
  console.log(verificationCode);
  user.verificationCode = verificationCode;
  user.otpExpiry = otpExpiry;
  await user.save();

  const emailData = {
    to: [{ email }],
    sender: { name: BREVO_API_NAME, email: "noreply@mywebsite.com" },
    subject: "Your Verification OTP Code",
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
    password,
    message: "OTP sent successfully",
  });
};

export const verifyEmail = async (req, res) => {
  const { email, password, verificationCode } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email, verificationCode: parseInt(verificationCode) });
    if (!user || user.otpExpiry < Date.now()) return res.status(400).json({ message: "Invalid or expired OTP" });
    console.log(user);

    user.isVerified = true;
    // user.verificationCode = null;
    // user.otpExpiry = null;
    await user.save();

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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log(user);

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    if (user) await signin({ body: { email, password } }, res);

    // res.status(200).json({ message: "Welcome to mywebsite" });
  } catch (error) {
    res.status(400).json({ message: "Internal Server error" });
  }
};
