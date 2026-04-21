require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const path = require("path")

require("dotenv").config(); 

const app = express();

app.use(cors()); 
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/otp", require("./routes/otpRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

module.exports = app;

