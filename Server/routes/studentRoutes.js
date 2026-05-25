const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const controller = require("../controllers/studentController");

router.get("/", authMiddleware, controller.getStudents);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  controller.addStudent
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  controller.updateStudent
);

router.delete("/:id", authMiddleware, controller.deleteStudent);

module.exports = router;