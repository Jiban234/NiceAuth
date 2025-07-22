import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";

// New user Registration
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check for missing details
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    // if user already exist
    if (existingUser) {
      return res.json({
        success: false,
        message: "User apready exist",
      });
    }

    // if user does not exist then make a new user
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send a welcome mail to user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to NiceAuth",
      text: `Welcome to NiceAuth website. Your account has been created with email id ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "New user created",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Log In
export const login = async (req, res) => {
  const { email, password } = req.body;

  // check for missing details
  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    // if user doesnot exist
    if (!user) {
      res.json({
        success: false,
        message: "Invalid email",
      });
    }

    // if user exists check for valid password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    // if valid password then send cookie
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Logged In",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Sending OTP to verify email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    // check is the account is already verified or not
    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Account is already verified",
      });
    }
    // if not verified then send OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    // send this otp in mail to verify the user in frontend
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Verification OTP Sent on Email",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// match the OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  // check for valid details
  if (!userId || !otp) {
    res.json({
      success: false,
      message: "missing details",
    });
  }

  // if user entered all valid details

  try {
    const user = await userModel.findById(userId);
    // check if user exists or not
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
    }

    // now verify otp
    if (user.verifyOtp == "" || user.verifyOtp !== otp) {
      res.json({
        success: false,
        message: "Invalid otp",
      });
    }

    // check for otp expiry
    if(user.verifyOtpExpireAt < Date.now()){
      res.json({
        success: false,
        message: "OTP Expired",
      });
    }

    // if otp not expired
    user.isVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0

    await user.save();

    res.json({
        success: True,
        message: "Email verified Sucessfully",
      });
  } catch (error) {}
};

// check if user is alredy logged in or not
export const isAuthenticated = async (req,res) => {
  try {
    res.json({
        success: true,
      });
  } catch (error) {
    res.json({
        success: false,
        message: error.message,
      });
  }
}

// Send Password Reset OTP
export const sendResetOtp = async(req,res)=>{
  const {email} = req.body;
  if(!email){
    res.json({
        success: false,
        message: "Email is required",
      });
  }

  try {
    const user = await userModel.findOne({email});
    // check if user exists
    if(!user){
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    // if exists then send otp
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtpOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    // send this otp in email to reset password
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP Sent on Email to Reset Password",
    });

  } catch (error) {
    res.json({
        success: false,
        message: error.message,
      });
  }
}

// Reset User Password
export const resetPassword = async (req,res)=>{
  const {email,otp,newPassword} = req.body;
  // check for details
  if(!email || !otp || !newPassword){
    return res.json({
        success: false,
        message: "Email, OTP, New Password are required",
      });
  }

  try {
    
    const user = await userModel.findOne({email});
    // check if user exists
    if(!user){
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // check for valid otp
    if(user.resetOtp === "" || user.resetOtp !== otp){
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }  
    // check for reset-otp-expiry
    if(user.resetOtpExpireAt < Date.now()){
      return res.json({
        success: false,
        message: "OTP is expired",
      });
    }

    // if all passed then store the hashed password
      const hashedPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
        success: true,
        message: "Password Reset Successfully",
      });

  } catch (error) {
    res.json({
        success: false,
        message: error.message,
      });
  }
}
