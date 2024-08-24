const Categories = require("../model/category.model");
const { v4: uuidv4 } = require("uuid");
const db = require("../../../config/database.config");

module.exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Categories.getAllCategories();
    res.status(200).json({
      code: 200,
      message: "Get all categories successful",
      data: allCategories,
    });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports.createCategory = async (req, res) => {
  const CategoryID = uuidv4();

  try {
    const { CategoryName } = req.body;
    const lowerCaseCategoryName = CategoryName.toLowerCase();

    // Kiểm tra tên danh mục đã tồn tại chưa
    const check = await Categories.checkCategoryName(lowerCaseCategoryName);
    if (check) {
      return res.status(400).json({
        code: 400,
        message: "Category name already exists",
      });
    }

    // Kiểm tra tên danh mục không được để trống
    if (!lowerCaseCategoryName) {
      return res.status(400).json({
        code: 400,
        message: "Category name is required",
      });
    }

    // Tạo danh mục mới
    const newCategory = await Categories.createCategory(
      CategoryID,
      lowerCaseCategoryName
    );

    res.status(201).json({
      code: 201,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports.getDetailCategories = async (req, res) => {
  try {
    const detailCategories = await Categories.getDetailCategories(
      req?.params.id
    );
    if (!detailCategories) {
      return res.json({
        code: 404,
        message: "No category found ",
      });
    }

    res.status(200).json({
      code: 200,
      message: "successfully",
      data: detailCategories.CategoryName,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
