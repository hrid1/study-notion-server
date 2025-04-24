const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Proerties",
      });
    }
    // create section
    const newSection = await Section.create({ sectionName });
    // update course with section objId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    // return respose
    return res.status(200).json({
      success: false,
      message: "Section create successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section, please try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // data input
    const { sectionName, sectionId } = req.body;
    // data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Proerties",
      });
    }
    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section, please try again",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // get ID - assuming that we are sendiing ID in params
    const { sectionId } = req.params;
    if (!sectionId) return res.status(401).json({ message: "data not found" });

    //delete section
     await Section.findByIdAndDelete(sectionId);
     //TODO Do we need to delete the entry the course schema  ??
    // return response 
    return res.status(201).json({
      success: true,
      message: "Section deleted successfully",
    }); 
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to Delete section, please try again",
      error: error.message,
    });
  }
};
