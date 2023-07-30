// const Tag = require("../models/tags");
const Category = require("../models/categories");

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
    const allcategories = await Category.find(
      {},
      { name: true, description: true }
    );
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

// category page details handler function
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categories
    const { categoryId } = req.body;
    // get cources of spacefic categories
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();
    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "data not found",
      });
    }
    // get diff categories cources
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();
    // get top selling cource s
    // Get top-selling courses across all categories
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // return responce
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
