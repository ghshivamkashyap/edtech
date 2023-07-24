const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
  },
  description: {
    type:String,
  },
  cours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
 
});

module.exports = mongoose.model("Tag", tagsSchema);
