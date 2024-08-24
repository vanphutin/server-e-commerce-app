const Shop = require("../model/shop.model");
const { formatShopData } = require("../Helper/shopHelper");

module.exports.getProductShop = async (req, res) => {
  const UserID = req.params.id;
  const categories = req.query.categories || "";

  if (!UserID) {
    return res.status(400).json({
      code: 400,
      message: "Missing required fields",
    });
  }

  try {
    const shopProduct = await Shop.getProductShop(UserID, categories);

    if (shopProduct.length <= 0) {
      return res.status(404).json({
        code: 404,
        message: "Product not found",
      });
    }

    const formattedData = formatShopData(shopProduct);

    return res.status(200).json({
      code: 200,
      message: "Get successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
