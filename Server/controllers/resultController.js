const supabase = require("../config/supabase");
const { sendResultEmail } = require("../services/emailService");

// ADD RESULT
exports.addResult = async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      student_email,
      subject,
      marks,
      grade,
      batch,
    } = req.body;

    if (
      !student_id ||
      !student_name ||
      !student_email ||
      !subject ||
      marks === undefined ||
      marks === "" ||
      !grade ||
      !batch
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { data, error } = await supabase
      .from("results")
      .insert([
        {
          student_id,
          student_name,
          student_email,
          subject,
          marks: Number(marks),
          grade,
          batch,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      await sendResultEmail(
        student_email,
        student_name,
        subject,
        marks,
        grade,
        batch
      );
    } catch (emailError) {
      console.log("Result email error:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Result added successfully",
      data,
    });
  } catch (error) {
    console.log("Result Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET RESULTS
exports.getResults = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE RESULT
exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const resultId = Number(id);

    if (!resultId) {
      return res.status(400).json({
        success: false,
        message: "Invalid result id",
      });
    }

    const { data, error } = await supabase
      .from("results")
      .delete()
      .eq("id", resultId)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.json({
      success: true,
      message: "Result deleted permanently",
      deleted: data[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};