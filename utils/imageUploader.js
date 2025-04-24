const cloudonary = require("cloudinary").v2;

exports.uploadImgToCloudonary = async (file, folder, height, quality) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  return await cloudonary.uploader.upload(file.tempFilePath, options);
};
