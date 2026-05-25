const supabase = require("../config/supabase");

exports.findAllStudents = async () => {
  return await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
};

exports.findStudentById = async (id) => {
  return await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();
};