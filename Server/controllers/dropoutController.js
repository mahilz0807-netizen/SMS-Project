const supabase = require("../config/supabase");

// ADD STUDENT TO DROPOUT TABLE
exports.addDropout = async (req, res) => {
  try {
    const student = req.body;

    if (!student.student_id || !student.full_name || !student.reason) {
      return res.status(400).json({
        success: false,
        message: "Student details and reason are required",
      });
    }

    const dropoutData = {
      student_id: student.student_id,
      full_name: student.full_name,
      email: student.email || null,
      phone: student.phone || null,
      gender: student.gender || null,
      dob: student.dob || null,
      nic: student.nic || null,
      occupation: student.occupation || null,
      course: student.course || null,
      course_type: student.course_type || null,
      admission_date: student.admission_date || null,
      qualification: student.qualification || null,

      permanent_address: student.permanent_address || student.address || null,
      current_address: student.current_address || null,
      district: student.district || null,
      home_phone: student.home_phone || null,

      father_name: student.father_name || student.parent_name || null,
      mother_name: student.mother_name || null,
      father_phone: student.father_phone || student.parent_phone || null,
      mother_phone: student.mother_phone || null,
      father_occupation: student.father_occupation || null,
      mother_occupation: student.mother_occupation || null,
      monthly_income: student.monthly_income || null,

      guardian_name: student.guardian_name || null,
      guardian_relation: student.guardian_relation || null,
      guardian_phone: student.guardian_phone || null,
      guardian_address: student.guardian_address || null,

      school_name: student.school_name || null,
      education_year: student.education_year || null,
      exam_results: student.exam_results || null,
      other_qualifications: student.other_qualifications || null,

      image: student.image || null,
      image_url: student.image_url || student.imageUrl || null,
      reason: student.reason,
    };

    const { data, error } = await supabase
      .from("dropouts")
      .insert([dropoutData])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Student moved to dropout successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL DROPOUT STUDENTS
exports.getDropouts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("dropouts")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// RESTORE DROPOUT STUDENT TO STUDENTS TABLE
exports.restoreStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: dropout, error: fetchError } = await supabase
      .from("dropouts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !dropout) {
      return res.status(404).json({
        success: false,
        message: "Dropout student not found",
      });
    }

    const studentData = {
      full_name: dropout.full_name,
      email: dropout.email,
      phone: dropout.phone,
      gender: dropout.gender,
      dob: dropout.dob,
      nic: dropout.nic,
      occupation: dropout.occupation,
      course: dropout.course,
      course_type: dropout.course_type,
      admission_date: dropout.admission_date,
      qualification: dropout.qualification,

      permanent_address: dropout.permanent_address,
      current_address: dropout.current_address,
      district: dropout.district,
      home_phone: dropout.home_phone,

      father_name: dropout.father_name,
      mother_name: dropout.mother_name,
      father_phone: dropout.father_phone,
      mother_phone: dropout.mother_phone,
      father_occupation: dropout.father_occupation,
      mother_occupation: dropout.mother_occupation,
      monthly_income: dropout.monthly_income,

      guardian_name: dropout.guardian_name,
      guardian_relation: dropout.guardian_relation,
      guardian_phone: dropout.guardian_phone,
      guardian_address: dropout.guardian_address,

      school_name: dropout.school_name,
      education_year: dropout.education_year,
      exam_results: dropout.exam_results,
      other_qualifications: dropout.other_qualifications,

      image: dropout.image,
      image_url: dropout.image_url,
    };

    const { error: insertError } = await supabase
      .from("students")
      .insert([studentData]);

    if (insertError) {
      return res.status(400).json({
        success: false,
        message: insertError.message,
      });
    }

    const { error: deleteError } = await supabase
      .from("dropouts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res.status(400).json({
        success: false,
        message: deleteError.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Student restored successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE DROPOUT PERMANENTLY
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

    res.status(200).json({
      success: true,
      message: "Dropout student deleted permanently",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};