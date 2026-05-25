const supabase = require("../config/supabase");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendNotification = async (req, res) => {
  try {
    const { course, title, message, type } = req.body;

    if (!course || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Course, title and message are required",
      });
    }

    const { data: students, error: studentError } = await supabase
      .from("students")
      .select("id, full_name, email, course")
      .eq("course", course);

    if (studentError) {
      return res.status(400).json({
        success: false,
        message: studentError.message,
      });
    }

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No students found for this course",
      });
    }

    const validStudents = students.filter((student) => student.email);

    if (validStudents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No student emails found for this course",
      });
    }

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert([
        {
          course,
          title,
          message,
          type: type || "Notification",
        },
      ]);

    if (notificationError) {
      return res.status(400).json({
        success: false,
        message: notificationError.message,
      });
    }

    await Promise.all(
      validStudents.map((student) =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: `${type || "Notification"} - ${title}`,
          html: `
            <div style="font-family: Arial; background:#f4f7fb; padding:20px;">
              <div style="max-width:600px; margin:auto; background:white; padding:25px; border-radius:12px;">
                <h2 style="color:#2563eb;">${title}</h2>
                <p>Hello <b>${student.full_name}</b>,</p>
                <p>${message}</p>
                <hr/>
                <p><b>Course:</b> ${course}</p>
                <p><b>Type:</b> ${type || "Notification"}</p>
                <p style="font-size:12px; color:#64748b;">
                  This message was sent by your institute.
                </p>
              </div>
            </div>
          `,
        })
      )
    );

    res.json({
      success: true,
      message: `Notification sent to ${validStudents.length} students`,
    });
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};