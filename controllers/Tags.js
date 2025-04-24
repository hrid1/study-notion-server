const Tag = require("../models/Tags");

// 1. create Tag handler function
exports.createTag = async (req, res) => {
  try {
    const { name, description } = req.body;
    // validation
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All fields required",
      });
    }

    // create entry in DB
    const tagDetils = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetils);
    // return respose
    return res.status(200).json({
      success: true,
      message: "Tag created successfully.",
    });
  } catch (error) {
    console.log("Create Tag", error);
    res.status(400).json({
      success: false,
      message: "All fields are requrie",
    });
  }
};

// 2. getALlTags handler function
exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: false,
      message: "All fields are required",
      allTags,
    });
  } catch (error) {
    console.log("Create Tag", error);
    res.status(400).json({
      success: false,
      message: "All fields are requrie",
    });
  }
};
