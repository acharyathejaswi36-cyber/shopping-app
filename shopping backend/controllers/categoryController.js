const Category = require("../models/Category");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await Category.create({ name: name.trim(), description });

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Failed to create category" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category" });
  }
};

exports.getProductsByCategoryId = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ category: req.params.id }).populate(
      "category",
      "name"
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};