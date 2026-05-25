const supabase = require("../config/supabase");

exports.findAllAttendance = async () => {
  return await supabase
    .from("attendance")
    .select("*, students(full_name,email)")
    .order("created_at", { ascending: false });
};