const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addResult,
  getResults,
  deleteResult,
} = require("../controllers/resultController");

router.post("/", authMiddleware, addResult);
router.get("/", authMiddleware, getResults);
router.delete("/:id", authMiddleware, deleteResult);

module.exports = router;