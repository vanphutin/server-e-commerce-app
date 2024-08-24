const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

const Cart = {
  postAddToCart: async (
    idCartItem,
    UserID,
    ProductID,
    quantity,
    size,
    notes
  ) => {
    const sql_addCart =
      "INSERT INTO cartitems(idCartItem,UserID,ProductID,quantity,size,notes) VALUE(?, ?, ?, ?, ? ,?) ";

    try {
      const result = await query(sql_addCart, [
        idCartItem,
        UserID,
        ProductID,
        quantity,
        size,
        notes,
      ]);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  getCartItems: async (userID) => {
    const sql_cartItems = `
      SELECT p.*, c.quantity, c.size, c.notes,c.idCartItem
      FROM products p
      JOIN cartitems c ON p.ProductID = c.ProductID
      WHERE c.UserID = ?
    `;
    try {
      const result = await query(sql_cartItems, [userID]);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
  deleteCartItems: async (idCartItem) => {
    const sql_deleteCartItem = "DELETE FROM cartitems WHERE idCartItem = ?";
    try {
      const result = await query(sql_deleteCartItem, [idCartItem]);
      return result;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  },
};

module.exports = Cart;
