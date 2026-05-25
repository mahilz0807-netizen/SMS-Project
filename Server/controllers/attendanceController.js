const supabase = require("../config/supabase");

exports.getAttendance = async (req, res) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, students(full_name,email)");

  if (error) return res.status(400).json({ message: error.message });

  res.json(data);
};

exports.markAttendance = async (req, res) => {
  const { student_id, date, status } = req.body;

  const { data, error } = await supabase
    .from("attendance")
    .insert([{ student_id, date, status }])
    .select();

  if (error) return res.status(400).json({ message: error.message });

  res.status(201).json(data[0]);
};