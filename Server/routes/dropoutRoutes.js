const express = require("express");
const router = express.Router();

const {
  addDropout,
  getDropouts,
  restoreStudent,
  deleteDropout,
} = require("../controllers/dropoutController");

router.post("/", addDropout);
router.get("/", getDropouts);
router.put("/restore/:id", restoreStudent);
router.delete("/:id", deleteDropout);

module.exports = router;