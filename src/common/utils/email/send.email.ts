import nodemailer from "nodemailer";
import { verifyEmailTemplate } from "./templates/verify.email.template";

export async function sendConfirmEmail(to: string, otp: string,subject:string,title:string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port:465,
    secure:true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,    
    to,
    subject,
    text: `Your OTP code is: ${otp}`,            
    html: verifyEmailTemplate(otp, title),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}
