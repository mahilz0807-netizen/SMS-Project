const supabase = require("../config/supabase");

exports.addDropout = async (req, res) => {
  try {
    const { student_id, full_name, email, course, reason, image } = req.body;

    if (!student_id || !full_name || !reason) {
      return res.status(400).json({
        success: false,
        message: "Student name and reason are required",
      });
    }

    const { data, error } = await supabase
      .from("dropouts")
      .insert([
        {
          student_id,
          full_name,
          email,
          course,
          reason,
          image,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Student saved to dropout list",
      data: data[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDropouts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("dropouts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteDropout = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("dropouts")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dropout deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};