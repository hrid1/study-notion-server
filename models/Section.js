const mongoose = require("mongoose");
const SubSection = require("./SubSection");

const SectionSchema = new mongoose({
  sectionName: {
    type: String,
  },
  SubSection: [
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "SubSection"
    }
  ]
 
});

module.exports = mongoose.model("Section", SectionSchema);
