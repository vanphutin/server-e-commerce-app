const { v4: uuidv4 } = require("uuid");
const Orders = require("../model/order.model");
const db = require("../../../config/database.config");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

module.exports.getOrderItems = async (req, res) => {
  const { OrdersID, UserID, ProductID, quantity, total_price } = req.body;
  if (!OrdersID || !UserID || !ProductID || !quantity || !total_price) {
    return res.status(400).json({
      code: 404,
      message: "Missing required fields",
    });
  }
  try {
    const createOrder = await Orders.postOder(
      OrdersID,
      UserID,
      ProductID,
      quantity,
      total_price
    );
    if (!createOrder) {
      return res.json({
        code: 400,
        message: "No order found ",
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Create order successfully",
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
