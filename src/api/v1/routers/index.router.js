const express = require("express");
const authRoutes = require("./auth.router");
const userRoutes = require("./user.router");
const productRoutes = require("./product.router");
const categoryRoutes = require("./category.router");
const cartRoutes = require("./cart.router");
const heartRoutes = require("./heart.router");
const shopRoutes = require("./shop.router");
const orderRoutes = require("./order.router");
const path = require("path");

module.exports = (app) => {
  const router = express.Router();
  router.use("/heart", heartRoutes); // Mount the auth routes
  router.use("/cart", cartRoutes); // Mount the auth routes
  router.use("/category", categoryRoutes); // Mount the auth routes
  router.use("/auth", authRoutes); // Mount the auth routes
  router.use("/user", userRoutes); // Mount the auth routes
  router.use("/product", productRoutes); // Mount the auth routes
  router.use("/shop", shopRoutes); // Mount the auth routes
  router.use("/order", orderRoutes); // Mount the auth routes
  app.use(
    "/uploads/products",
    express.static(path.join(__dirname, "../../../../uploads/products"))
  );
  app.use(
    "/uploads/avatars",
    express.static(path.join(__dirname, "../../../../uploads/avatars"))
  );
  app.use("/api/v1", router); // Mount the API version 1 routes
};
