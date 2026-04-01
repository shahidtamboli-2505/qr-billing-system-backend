const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const billingRoutes = require("./routes/billingRoutes");
const reportRoutes = require("./routes/reportRoutes");
const tableRoutes = require("./routes/tableRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🧇 Belgian Bliss Backend Running...");
});

// API Routes
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/tables", tableRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;