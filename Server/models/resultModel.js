const supabase = require("../config/supabase");

exports.findAllResults = async () => {
  return await supabase
    .from("results")
    .select("*, students(full_name,email)")
    .order("created_at", { ascending: false });
};