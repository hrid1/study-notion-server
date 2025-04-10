const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// Auth middleware : verify token
const auth = async (req, res, next) => {
  try {
    // Extract token from multiple sources: cookies, body, or Authorization header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing or invalid",
      });
    }

    // Verify token and decode payload
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Assign decoded payload to request user
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
  } catch (error) {
    console.error(error); // Helpful for debugging
    return res.status(500).json({
      success: false,
      message: "An error occurred while validating the token",
    });
  }
};

// isStudent
const isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for student only",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User role cann't be verified, please try again!",
    });
  }
};

// isInstructor
const isInstructor = async (req, res, next) => {
  try {
    if (req.user.role !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructor only",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User role cann't be verified, please try again!",
    });
  }
};

// isAdmin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User role cann't be verified, please try again!",
    });
  }
};

module.exports = { auth, isStudent, isInstructor, isAdmin };
