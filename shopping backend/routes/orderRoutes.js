const express = require("express");
const router = express.Router();
const {placeOrder,getUserOrders,getOrderById,cancelOrder,updateOrderStatus} = require("../controllers/orderController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, placeOrder);      
router.get("/", auth, getUserOrders);   
router.get("/:id", auth, getOrderById);  
router.put("/:id/cancel", auth, cancelOrder);
router.put("/:id/status", auth, updateOrderStatus);


module.exports = router;
