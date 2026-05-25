const supabase = require("../config/supabase");
const fs = require("fs");
const path = require("path");
const { sendWelcomeEmail } = require("../services/emailService");

const deleteLocalImage = (imagePath) => {
  if (!imagePath) return;

  const cleanPath = imagePath.startsWith("/")
    ? imagePath.substring(1)
    : imagePath;

  const fullPath = path.join(__dirname, "..", cleanPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// GET STUDENTS
exports.getStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ADD STUDENT
exports.addStudent = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const studentData = {
      ...req.body,
      image,
      agree_discontinue_fee:
        req.body.agree_discontinue_fee === "true" ||
        req.body.agree_discontinue_fee === true,
    };

    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select()
      .single();

    if (error) {
      deleteLocalImage(image);
      return res.status(400).json({ success: false, message: error.message });
    }

    let emailSent = false;

    try {
      if (data.email && data.full_name) {
        await sendWelcomeEmail(data.email, data.full_name);
        emailSent = true;
      }
    } catch (emailError) {
      console.log("Email error:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Student added successfully and email sent"
        : "Student added successfully but email not sent",
      student: data,
      emailSent,
    });
  } catch (err) {
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }

    return res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: oldStudent, error: oldError } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (oldError || !oldStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    let image = oldStudent.image;

    if (req.file) {
      deleteLocalImage(oldStudent.image);
      image = `/uploads/${req.file.filename}`;
    }

    const updatedData = {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      nic: req.body.nic,
      address: req.body.address,
      course: req.body.course,
      qualification: req.body.qualification,
      parent_name: req.body.parent_name,
      parent_phone: req.body.parent_phone,
      parent_address: req.body.parent_address,
      guardian_name: req.body.guardian_name,
      guardian_relation: req.body.guardian_relation,
      guardian_phone: req.body.guardian_phone,
      guardian_address: req.body.guardian_address,
      image,
      agree_discontinue_fee:
        req.body.agree_discontinue_fee === "true" ||
        req.body.agree_discontinue_fee === true,
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });

    const { data, error } = await supabase
      .from("students")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (req.file) {
        deleteLocalImage(`/uploads/${req.file.filename}`);
      }

      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: data,
    });
  } catch (err) {
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }

    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE STUDENT
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: student, error: findError } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (student.image) {
      deleteLocalImage(student.image);
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};