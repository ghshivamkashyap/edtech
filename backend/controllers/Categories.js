// const Tag = require("../models/tags");
const Catagory=require('../models/categories')

// crate tag ka handlr function likhna hai bhai

exports.createCategory = async (rq, res) => {
  try {
    // data fenth kar lo

    const { name, description } = req.body;

    // validation

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // db me entry karado bhai

    const categorydetils = await Category.create({
      name: name,
      description: description,
    });

    console.log(categorydetils);
    return res.status(200).json({
      success: true,
      message: "category created successfully",
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get al, tags handler function

exports.showAllCategories = async (req, res) => {
  try {
    const allcategories = await Category.find({}, { name: true, description: true });
    return res.status(200).json({
      success: true,
      message: "all categories returned successfully",
      alltags,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
