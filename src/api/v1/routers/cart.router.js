const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller");

router.post("/add", CartController.postAddToCart);
router.get("/items/", CartController.getCartItems);
router.delete("/item/:id", CartController.deleteCartItems);

module.exports = router;
