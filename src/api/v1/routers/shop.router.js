const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop.controller");

router.get("/:id/product", shopController.getProductShop);

module.exports = router;
