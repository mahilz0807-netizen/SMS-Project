const transporter = require("../config/mailer");

/* ===============================
   COMMON EMAIL TEMPLATE
================================= */

const emailTemplate = (title, content) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px 20px;">
      <div style="max-width:600px; margin:auto; background:white; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">

        <div style="background:linear-gradient(135deg,#2563eb,#1e40af); padding:30px; text-align:center;">
          <h1 style="color:white; margin:0; font-size:28px;">Little Tech Academy</h1>
          <p style="color:#dbeafe; margin-top:10px;">Student Management System</p>
        </div>

        <div style="padding:40px 30px;">
          <h2 style="color:#0f172a; margin-bottom:20px;">${title}</h2>
          <div style="color:#475569; line-height:1.8; font-size:15px;">
            ${content}
          </div>
        </div>

        <div style="background:#f8fafc; padding:20px; text-align:center; border-top:1px solid #e2e8f0;">
          <p style="margin:0; color:#64748b; font-size:14px;">
            © 2026 Little Tech Academy
          </p>
        </div>

      </div>
    </div>
  `;
};

/* ===============================
   RESET PASSWORD EMAIL
================================= */

/* ===============================
   WELCOME EMAIL
================================= */

exports.sendWelcomeEmail = async (email, name) => {
  try {
    return await transporter.sendMail({
      from: `"Little Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Student Management System",

      html: emailTemplate(
        `Welcome ${name} 👋`,
        `
          <p>You are successfully registered in our <b>Student Management System</b>.</p>
          <p>We are excited to have you with us.</p>

          <div style="margin-top:25px; padding:20px; background:#eff6ff; border-radius:12px;">
            <b>Student Status:</b> Active
          </div>

          <p style="margin-top:30px;">Thank you ❤️</p>
        `
      ),
    });
  } catch (error) {
    console.log("Welcome Email Error:", error.message);
  }
};

/* ===============================
   RESULT EMAIL
================================= */

exports.sendResultEmail = async (email, name, subject, marks, grade) => {
  try {
    return await transporter.sendMail({
      from: `"Little Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📘 Result Published",

      html: emailTemplate(
        `Hello ${name} 👨‍🎓`,
        `
          <p>Your result has been published successfully.</p>

          <table style="width:100%; border-collapse:collapse; margin-top:20px;">
            <tr>
              <td style="padding:12px; border:1px solid #ddd;">Subject</td>
              <td style="padding:12px; border:1px solid #ddd;">${subject}</td>
            </tr>
            <tr>
              <td style="padding:12px; border:1px solid #ddd;">Marks</td>
              <td style="padding:12px; border:1px solid #ddd;">${marks}</td>
            </tr>
            <tr>
              <td style="padding:12px; border:1px solid #ddd;">Grade</td>
              <td style="padding:12px; border:1px solid #ddd; font-weight:bold; color:#2563eb;">
                ${grade}
              </td>
            </tr>
          </table>

          <p style="margin-top:25px;">Keep working hard 🚀</p>
        `
      ),
    });
  } catch (error) {
    console.log("Result Email Error:", error.message);
  }
};

/* ===============================
   ATTENDANCE ALERT EMAIL
================================= */

exports.sendAttendanceAlert = async (email, name, status) => {
  try {
    return await transporter.sendMail({
      from: `"Little Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📢 Attendance Update",

      html: emailTemplate(
        `Hello ${name}`,
        `
          <p>Your attendance status has been updated.</p>

          <div style="
            margin-top:25px;
            padding:20px;
            border-radius:12px;
            background:${status === "present" ? "#dcfce7" : "#fee2e2"};
            color:${status === "present" ? "#166534" : "#991b1b"};
            font-weight:bold;
            text-align:center;
            font-size:18px;
          ">
            ${status.toUpperCase()}
          </div>

          <p style="margin-top:25px;">Please contact the administration if needed.</p>
        `
      ),
    });
  } catch (error) {
    console.log("Attendance Email Error:", error.message);
  }
};