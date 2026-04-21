const express = require("express");
const router = express.Router();
const {addCategory,getAllCategories,getCategoryById,getProductsByCategoryId} = require("../controllers/categoryController");

router.post("/", addCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategoryId);

module.exports = router;
