// model/category.model.js
const { log } = require("console");
const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const Categories = {
  getAllCategories: async () => {
    const sql_categories = "SELECT * FROM productcategories";
    try {
      const result = await query(sql_categories);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  checkCategoryName: async (CategoryName) => {
    const sql_check = "SELECT * FROM productcategories WHERE CategoryName = ?";
    try {
      const result = await query(sql_check, [CategoryName]);
      return result.length > 0;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },

  createCategory: async (CategoryID, CategoryName) => {
    const sql_create =
      "INSERT INTO productcategories (CategoryID, CategoryName) VALUES (?,?)";
    try {
      const result = await query(sql_create, [CategoryID, CategoryName]);
      return result;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  getDetailCategories: async (CategoryID) => {
    const sql_detail = "SELECT * FROM productcategories WHERE CategoryID =  ?";
    try {
      const result = await query(sql_detail, [CategoryID]);
      return result[0];
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
};

module.exports = Categories;
