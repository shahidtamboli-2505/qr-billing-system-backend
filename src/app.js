import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorMiddleware.js";

import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running and routes are active!",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/billing", billingRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;