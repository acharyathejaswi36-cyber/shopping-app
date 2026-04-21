const express = require("express");
const router = express.Router();
const {addToCart,getCart,updateCartItem,removeFromCart,clearCart} = require("../controllers/cartController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, addToCart);
router.get("/", auth, getCart);
router.put("/:productId", auth, updateCartItem);
router.delete("/:productId", auth, removeFromCart);
router.delete("/", auth, clearCart);

module.exports = router;
