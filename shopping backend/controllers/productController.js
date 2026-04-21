const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }

    if (stock === undefined || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ message: "Valid stock count is required" });
    }

    if (!category || !isValidId(category)) {
      return res.status(400).json({ message: "Valid category ID is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const image = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim(),
      price: Number(price),
      stock: Number(stock),
      category,
      image,
    });

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    const filter = {};

    if (category) {
      if (!isValidId(category)) return res.status(400).json({ message: "Invalid category ID" });
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) filter.name = { $regex: search, $options: "i" };

    const [products, total] = await Promise.all([
      Product.find(filter).populate("category", "name").skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });

    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });

    const { name, description, price, stock, category } = req.body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      return res.status(400).json({ message: "Invalid product name" });
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (stock !== undefined && (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
      return res.status(400).json({ message: "Invalid stock count" });
    }

    if (category !== undefined) {
      if (!isValidId(category)) return res.status(400).json({ message: "Invalid category ID" });
      const categoryExists = await Category.findById(category);
      if (!categoryExists) return res.status(404).json({ message: "Category not found" });
    }

    if (req.file) {
      const existing = await Product.findById(req.params.id);
      if (existing?.image) {
        const oldPath = path.join(__dirname, "..", existing.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(category && { category }),
        ...(req.file && { image: `/uploads/products/${req.file.filename}` }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ message: "Invalid product ID" });

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};