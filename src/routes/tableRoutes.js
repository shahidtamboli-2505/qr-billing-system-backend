const express = require("express");
const router = express.Router();

const { getTableStatus } = require("../controllers/tableController");

router.get("/", getTableStatus);

module.exports = router;
