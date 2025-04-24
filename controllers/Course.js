const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImgToCloudonary } = require("../utils/imageUploader");

// 1. createCourse handler funtion
exports.createCourse = async (req, res) => {
  try {
    // fetch all data
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    // get thumble
    const thumbnail = req.files.thumnailImage;
    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }
    // check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details", instructorDetails);
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Detials not found",
      });
    }

    // check given tag valid or not
    const tagDetils = await Tag.findById(tag);
    if (!tagDetils) {
      return res.status(404).json({
        success: false,
        message: "Tag Detials not found",
      });
    }

    // upload img top cloudinary
    const thumbnailImg = await uploadImgToCloudonary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetils._id,
      thumbnail: thumbnailImg.secure_url,
    });

    // add the new course to the user shcema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    // update the Tag ka schema
    // TODO

    //return respose
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Course creation faild",
    });
  }
};

// 2.  getall Course handler function

exports.showAllCourses = async (req, res) => {
  try {
    //TODO: change value
    const allCourses = await Course.find({});
    return res.status(200).json({
      success: true,
      message: "Data for all course fetch Successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Course creation faild",
    });
  }
};
