const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto=require("crypto");
const bcrypt = require("bcryptjs");

const ErrorResponse = (message, statuscode, res) => {
  res.status(statuscode).json({ message: message });
};
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(200).json({ token, name: user.username });
  } catch (err) {
    res.status(500).json({ message: "Failed to login user" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await User.findOne({
      _id: id,
    });
    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password has been successfully changed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.forgotPasswordRequest =async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetExpires = Date.now() + 3600000;
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.CLIENT_MAIL,
              pass: process.env.CLIENT_PASSWORD
          },
      });
      const mailOptions = {
          to: user.email,
          from: process.env.CLIENT_MAIL,
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${process.env.CLIENT_URL}/reset-password/${user._id}
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (err, response) => {
          if (err) return res.status(500).json({ error: err});
          res.status(200).json({ message: 'Email sent' });
      });
  } catch (err) {
  console.log(err, "err");
      res.status(500).json({ error:err });
  }
}

exports.userMe = async (request, response, next) => {
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    token = request.headers.authorization.split(" ")[1];
  }

  if (!token) {
    ErrorResponse("Not authorized to access this route", 401, response);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded, "decoded")
    let user = await User.findOne({
      _id: decoded?.userId,
    }).select("-password");

    if (!user) {
      ErrorResponse("Invalid User", 400, response);
    }
    response.status(200).json({ user: user });
  } catch (error) {
    console.log(error, "err");
    ErrorResponse("Not authorized to access this route", 401, response);
  }
};
