// model/category.model.js
const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const Oders = {
  postOder: async (OrdersID, UserID, ProductID, quantity, total_price) => {
    const sql_post =
      "INSERT INTO orderitems(OrdersID, UserID, ProductID,quantity,total_price) VALUE(?,?,?,?,?)";
    try {
      const result = query(sql_post, [
        OrdersID,
        UserID,
        ProductID,
        quantity,
        total_price,
      ]);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Oders;
