const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");

router.get("/", categoryController.getAllCategories);
router.get("/detail/:id", categoryController.getDetailCategories);
router.post("/", categoryController.createCategory);
module.exports = router;
