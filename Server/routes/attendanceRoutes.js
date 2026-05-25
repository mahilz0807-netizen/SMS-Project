const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const controller = require("../controllers/attendanceController");

router.get("/", authMiddleware, controller.getAttendance);
router.post("/", authMiddleware, controller.markAttendance);

module.exports = router;