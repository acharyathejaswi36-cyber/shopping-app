const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const STATUS_TRANSITIONS = {
  PLACED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const hasNullProduct = cart.items.some((item) => !item.product);
    if (hasNullProduct) {
      return res.status(400).json({ message: "Cart contains unavailable products" });
    }

    for (let item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    for (let item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
    });

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } }
    );

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to place order" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id, 
    }).populate("items.product", "name image price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "PLACED") {
      return res.status(400).json({ message: "Only PLACED orders can be cancelled" });
    }

    for (let item of order.items) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const { status } = req.body;
    const validStatuses = Object.keys(STATUS_TRANSITIONS);

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!STATUS_TRANSITIONS[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};