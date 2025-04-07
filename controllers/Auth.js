const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");

// sendOTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from req body
    const email = req.body;
    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registerd",
      });
    }

    // generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated ", otp);

    // check unquic otp or not
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    // create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);
    // return response successfully
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signUp
exports.signUp = async (req, res) => {
  try {
    // data fetch from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required!",
      });
    }
    //2 password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm password doesn't match!",
      });
    }

    // check user already exists
    const existingUser = await User.find({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent OTP
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent OTP", recentOtp);
    // validate OTP
    if (recentOtp.length == 0) {
      // OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not Found!",
      });
    } else if (otp !== recentOtp.otp) {
      // Invalid OTP
      return res.staus(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //   return res;
    return res.status(200).json({
      success: true,
      message: "User is regsiter successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
