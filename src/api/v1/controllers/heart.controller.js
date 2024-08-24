const Heart = require("../model/heart.model");
const db = require("../../../config/database.config");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

module.exports.isHeart = async (req, res) => {
  const ProductID = req.params.id;
  const { UserID } = req.body;

  const idHeart = uuidv4();
  if (!{ UserID }) {
    return res.status(400).json({
      code: 400,
      message: "error miss user id",
    });
  }

  try {
    // Kiểm tra xem sản phẩm có trong table
    const checkIsHeartQuery =
      "SELECT isFavourited FROM heartitems WHERE ProductID = ?";

    const [product] = await query(checkIsHeartQuery, [ProductID]);

    // nếu đã tồn tại sản phẩm (UPDATE isFavourited là false)
    const newFavourited = product?.isFavourited ? 0 : 1;
    if (product) {
      await query(
        "UPDATE heartitems SET isFavourited = ? WHERE ProductID = ?",
        [newFavourited, ProductID]
      );
      return res.status(200).json({
        code: 200,
        message: "Update status product successfully !",
      });
    }

    // Update isHeart status
    const updateResult = await Heart.isHeart(idHeart, ProductID, UserID);

    if (updateResult) {
      return res.status(200).json({
        code: 200,
        message: "Product heart status updated successfully",
        data: {
          ProductID,
          isHeart: updateResult,
        },
      });
    } else {
      return res.status(400).json({
        code: 400,
        message: "Failed to update product heart status",
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllHeart = async (req, res) => {
  const UserID = req?.params.id;
  if (!UserID) {
    return res.status(400).json({
      code: 400,
      message: "error miss user id",
    });
  }
  try {
    const getFavourited = await Heart.getAllHeart(UserID);

    if (getFavourited.length <= 0) {
      return res.json({
        code: 404,
        message: "No products favourited found",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Get all favourited successfully",
      data: getFavourited,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
