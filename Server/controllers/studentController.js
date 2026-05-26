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
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ADD STUDENT
exports.addStudent = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const studentData = {
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      nic: req.body.nic,
      occupation: req.body.occupation,

      course: req.body.course,
      course_type: req.body.course_type,
      admission_date: req.body.admission_date,
      qualification: req.body.qualification,

      permanent_address: req.body.permanent_address,
      current_address: req.body.current_address,
      district: req.body.district,
      home_phone: req.body.home_phone,

      father_name: req.body.father_name,
      mother_name: req.body.mother_name,
      father_phone: req.body.father_phone,
      mother_phone: req.body.mother_phone,
      father_occupation: req.body.father_occupation,
      mother_occupation: req.body.mother_occupation,
      monthly_income: req.body.monthly_income,

      guardian_name: req.body.guardian_name,
      guardian_relation: req.body.guardian_relation,
      guardian_phone: req.body.guardian_phone,
      guardian_address: req.body.guardian_address,

      school_name: req.body.school_name,
      education_year: req.body.education_year,
      exam_results: req.body.exam_results,
      other_qualifications: req.body.other_qualifications,

      image,

      agree_discontinue_fee:
        req.body.agree_discontinue_fee === "true" ||
        req.body.agree_discontinue_fee === true,
    };

    Object.keys(studentData).forEach((key) => {
      if (studentData[key] === undefined || studentData[key] === "") {
        studentData[key] = null;
      }
    });

    const { data, error } = await supabase
      .from("students")
      .insert([studentData])
      .select()
      .single();

    if (error) {
      deleteLocalImage(image);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    try {
      if (data.email && data.full_name) {
        await sendWelcomeEmail(data.email, data.full_name);
      }
    } catch (emailError) {
      console.log("Email error:", emailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: data,
    });
  } catch (err) {
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
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
      ...req.body,
      image,
      agree_discontinue_fee:
        req.body.agree_discontinue_fee === "true" ||
        req.body.agree_discontinue_fee === true,
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === undefined || updatedData[key] === "") {
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

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: data,
    });
  } catch (err) {
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// MOVE STUDENT TO DROPOUT
// MOVE STUDENT TO DROPOUT
// DELETE STUDENT PERMANENTLY
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // remove image if exists
    deleteLocalImage(student.image);

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

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};