const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.BD_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB connected"))
    .catch((err) => {
      console.log("db connection failed");
      console.error(err);
      process.exit(1);
    });
};
