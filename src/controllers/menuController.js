const MenuItem = require("../models/MenuItem");

// GET ALL MENU ITEMS
const getAllMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
};

// CREATE MENU ITEM
const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Item created", data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};

// UPDATE MENU ITEM
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, message: "Item updated", data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// DELETE MENU ITEM
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
