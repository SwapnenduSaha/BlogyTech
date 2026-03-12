const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendAccountVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PWD,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Request for Account Verification",
      html: `<p>You are receiving this mail because you (or someone else) have requested to verify your account.</p>
    <p>Please click on the following link or paste that into the browser to complete the process.</p>
    <a href="http://localhost:3000/reset-password/${verificationToken}></a>
    <p>If you did not request then ignore this message and password will remain unchanged</p>
    `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent with message id ${info.messageId}`);
  } catch (err) {
    next(err);
  }
};

module.exports = sendAccountVerificationEmail;