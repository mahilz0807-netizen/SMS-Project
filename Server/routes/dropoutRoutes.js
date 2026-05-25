const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addDropout,
  getDropouts,
  deleteDropout,
} = require("../controllers/dropoutController");

router.post("/", authMiddleware, addDropout);
router.get("/", authMiddleware, getDropouts);
router.delete("/:id", authMiddleware, deleteDropout);

module.exports = router;