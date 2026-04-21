const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");
const upload = require("../config/multer");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", auth, adminAuth, upload.single("image"), addProduct);
router.put("/:id", auth, adminAuth, upload.single("image"), updateProduct);
router.delete("/:id", auth, adminAuth, deleteProduct);

module.exports = router;