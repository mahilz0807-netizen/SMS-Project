const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// EMAIL TEMPLATE
const resetPasswordTemplate = (resetLink) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width:600px;
          background:#ffffff;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.12);
        ">

          <tr>
            <td style="
              background:linear-gradient(135deg,#2563eb,#7c3aed);
              padding:35px;
              text-align:center;
              color:white;
            ">
              <h1 style="margin:0; font-size:28px;">Little Tech Academy</h1>
              <p style="margin:10px 0 0; font-size:15px;">
                Password Reset Request
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:35px; color:#334155;">

              <h2 style="margin:0 0 15px; color:#0f172a;">
                Reset Your Password
              </h2>

              <p style="font-size:16px; line-height:1.6;">
                We received a request to reset your account password.
                Click the button below to create a new password.
              </p>

              <div style="text-align:center; margin:35px 0;">
                <a href="${resetLink}" target="_blank" style="
                  background:linear-gradient(135deg,#2563eb,#7c3aed);
                  color:#ffffff;
                  padding:14px 28px;
                  text-decoration:none;
                  border-radius:10px;
                  font-weight:bold;
                  display:inline-block;
                  font-size:16px;
                ">
                  Reset Password
                </a>
              </div>

              <p style="font-size:14px; color:#64748b;">
                This link will expire in <b>15 minutes</b>.
              </p>

              <p style="font-size:14px; color:#64748b;">
                If the button does not work, copy and paste this link:
              </p>

              <p style="
                word-break:break-all;
                background:#f8fafc;
                padding:12px;
                border-radius:8px;
                font-size:13px;
                color:#2563eb;
              ">
                ${resetLink}
              </p>

              <p style="font-size:14px; color:#64748b;">
                If you did not request this, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <tr>
            <td style="
              background:#0f172a;
              color:#cbd5e1;
              text-align:center;
              padding:18px;
              font-size:13px;
            ">
              © 2026 Little Tech Academy. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// REGISTER ADMIN
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("admins")
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) return res.status(400).json({ message: error.message });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: data[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const { data: user, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Little Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - Little Tech Academy",
      html: resetPasswordTemplate(resetLink),
    });

    res.json({
      success: true,
      message: "Beautiful reset link sent successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("admins")
      .update({ password: hashedPassword })
      .eq("id", decoded.id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired link" });
  }
};