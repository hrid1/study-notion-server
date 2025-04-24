const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImgToCloudonary } = require("../utils/imageUploader");
const { updateSearchIndex } = require("../models/User");

// create subsetion

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;
    // extract file/video
    const video = req.files.videoFile;
    // validation
    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        messaga: "ALl fields are required",
      });
    }
    // uplaod video to cloudonary
    const uploadDetails = await uploadImgToCloudonary(
      video,
      process.env.FOLDER_NAME
    );
    // create a subsection
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // update section with this sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );
    //HW: updated section here , after adding populate query

    return res.status(200).json({
      success: false,
      message: "Sub section created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.messaga,
    });
  }
};

// HW:update subsection
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, timeDuration, description } = req.body;
    const video = req.files?.videoFile;

    // validation
    if (subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID is required",
      });
    }
    // Prepare the update object
    const updateData = {};
    if (title) updateData.title = title;
    if (timeDuration) updateData.timeDuration = timeDuration;
    if (description) updateData.description = description;

    // Handle video upload if a new file is provided
    if (video) {
      const uploadDetails = await uploadImgToCloudonary(
        video,
        process.env.FOLDER_NAME
      );
      updateData.videoUrl = uploadDetails.secure_url;
    }
    // Update the subsection
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      updateData,
      { new: true } // Return the updated document
    );

    // Check if the subsection exists
    if (!updatedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }
    // Return success response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      updatedSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// HW:delete subsection

exports.deleteSubSection = async (req, res) => {
  try {
    // Fetch the subsection ID from the request body
    const { subSectionId } = req.body;

    // Validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      });
    }

    // Find and delete the subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

    // Check if the subsection exists
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // Remove the subsection reference from the parent section
    await Section.findOneAndUpdate(
      { subSection: subSectionId },
      { $pull: { subSection: subSectionId } }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
