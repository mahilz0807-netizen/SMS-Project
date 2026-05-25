exports.validateStudent = (req, res, next) => {
  const { full_name, email } = req.body;

  if (!full_name || !email) {
    return res.status(400).json({
      message: "Student name and email are required"
    });
  }

  next();
};