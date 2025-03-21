const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const cnt = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Error from DB", error);
    process.exit(1);
  }
};

module.exports = connectDB;
