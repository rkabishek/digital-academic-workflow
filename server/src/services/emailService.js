const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

/**
 * Sends a password reset email.
 */
const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const from = process.env.EMAIL_FROM || `"AcadFlow" <${process.env.EMAIL_USER}>`;
  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#2563eb;padding:28px 32px">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">AcadFlow</h1>
        <p style="color:#bfdbfe;margin:4px 0 0;font-size:14px">Digital Academic Document Workflow</p>
      </div>
      <div style="padding:32px">
        <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px">Reset Your Password</h2>
        <p style="color:#64748b;margin:0 0 24px;font-size:15px">Hi <strong>${name}</strong>,<br/>We received a request to reset the password for your AcadFlow account.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px">Reset Password</a>
        <p style="color:#94a3b8;margin:24px 0 0;font-size:13px">This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:12px;margin:0">AcadFlow · Digital Academic Document Workflow and Management System</p>
      </div>
    </div>
  `;

  await getTransporter().sendMail({
    from,
    to,
    subject: 'Reset Your AcadFlow Password',
    html,
  });
};

/**
 * Sends a welcome email after registration.
 */
const sendWelcomeEmail = async ({ to, name, role, staffCode }) => {
  const from = process.env.EMAIL_FROM || `"AcadFlow" <${process.env.EMAIL_USER}>`;
  const staffMsg = staffCode
    ? `<p style="color:#64748b;font-size:14px;margin:16px 0">Your <strong>Staff Code</strong> is: <code style="background:#eff6ff;color:#2563eb;padding:2px 8px;border-radius:4px;font-size:15px;font-weight:700">${staffCode}</code><br/>Share this with your students so they can link their accounts to you.</p>`
    : '';

  await getTransporter().sendMail({
    from,
    to,
    subject: `Welcome to AcadFlow, ${name}!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
        <div style="background:#2563eb;padding:28px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">AcadFlow</h1>
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 8px;color:#0f172a">Welcome, ${name}!</h2>
          <p style="color:#64748b;margin:0 0 16px;font-size:15px">Your <strong>${role}</strong> account has been created successfully.</p>
          ${staffMsg}
          <p style="color:#94a3b8;font-size:13px;margin:24px 0 0">AcadFlow · Digital Academic Document Workflow</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
