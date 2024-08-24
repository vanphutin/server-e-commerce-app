const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const Shop = {
  getProductShop: async (UserID, categories) => {
    let sql_getProductShop = `SELECT p.*,c.CategoryName, u.UserID,u.UserName,u.UserFirstName,u.UserLastName,u.UserCity
                        FROM products p
                        JOIN productcategories c ON p.ProductCategoryID = c.CategoryID
                        JOIN users u ON p.UserID = u.UserID 
                        WHERE p.UserID = ? AND p.deleted = FALSE`;

    let params = [UserID];

    if (categories && categories.length > 0) {
      sql_getProductShop += ` AND c.CategoryName = ?`;
      params.push(categories);
    }

    try {
      const result = await query(sql_getProductShop, params);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Shop;
