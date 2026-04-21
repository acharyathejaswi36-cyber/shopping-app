const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId || !isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image"
    );

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || !isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId || !isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId
    );
    if (!itemExists) return res.status(404).json({ message: "Item not found in cart" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } }
    );

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};