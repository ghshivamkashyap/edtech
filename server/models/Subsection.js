// const mongoose = require("mongoose");

// const SubSectionSchema = new mongoose.Schema({
//   title: { type: String },
//   timeDuration: { type: String },
//   description: { type: String },
//   videoUrl: { type: String },
// });

// module.exports = mongoose.model("SubSection", SubSectionSchema);

const mongoose = require("mongoose");

// Check if the model already exists before defining it
module.exports = mongoose.models.Subsection || mongoose.model(
  "Subsection",
  new mongoose.Schema({
    title: { type: String },
    timeDuration: { type: String },
    description: { type: String },
    videoUrl: { type: String },
  })
);
