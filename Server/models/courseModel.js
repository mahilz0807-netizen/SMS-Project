const supabase = require("../config/supabase");

exports.findAllCourses = async () => {
  return await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });
};

exports.findCourseById = async (id) => {
  return await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();
};