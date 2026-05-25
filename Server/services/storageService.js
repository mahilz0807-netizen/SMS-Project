const supabase = require("../config/supabase");

exports.uploadFile = async (file, folder = "uploads") => {
  if (!file) return "";

  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  // Upload File
  const { error } = await supabase.storage
    .from("students")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  // Error Handling
  if (error) {
    throw new Error(error.message);
  }

  // Get Public URL
  const { data } = supabase.storage
    .from("students")
    .getPublicUrl(fileName);

  return data.publicUrl;
};