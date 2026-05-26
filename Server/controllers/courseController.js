const supabase = require("../config/supabase");

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("id", { ascending: false });

    if (error) return res.status(400).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD COURSE
exports.addCourse = async (req, res) => {
  try {
    const { title, code, batch, duration, fee, description } = req.body;

    if (!title || !code || !batch) {
      return res.status(400).json({
        message: "Course title, code and batch are required",
      });
    }

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          title,
          code,
          batch,
          duration,
          fee,
          description,
        },
      ])
      .select();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({
      message: "Course added successfully",
      course: data[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code, batch, duration, fee, description } = req.body;

    if (!title || !code || !batch) {
      return res.status(400).json({
        message: "Course title, code and batch are required",
      });
    }

    const { data, error } = await supabase
      .from("courses")
      .update({
        title,
        code,
        batch,
        duration,
        fee,
        description,
      })
      .eq("id", Number(id))
      .select();

    if (error) return res.status(400).json({ message: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Course not found with id: ${id}`,
      });
    }

    res.json({
      message: "Course updated successfully",
      course: data[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("courses")
      .delete()
      .eq("id", Number(id))
      .select();

    if (error) return res.status(400).json({ message: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: `Course not found with id: ${id}`,
      });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};