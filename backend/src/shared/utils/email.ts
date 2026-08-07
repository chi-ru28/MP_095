import nodemailer from 'nodemailer';
import { logger } from '../../infrastructure/logging/logger';

export const sendOTP = async (to: string, otp: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    logger.warn(`SMTP not configured! Simulating OTP sending. The OTP for ${to} is: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || 'ASCENDRA Support'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject: 'Your ASCENDRA Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e17; color: #fff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #ffd700; text-align: center;">ASCENDRA</h2>
        <p>You requested a password reset. Use the following 5-digit code to complete the process:</p>
        <div style="background: #111827; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 4px; border: 1px solid #374151; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #9ca3af;">This code expires in 15 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP sent successfully to ${to}`);
  } catch (error) {
    logger.error(`Failed to send OTP email to ${to}:`, error);
    throw new Error('Failed to send verification email');
  }
};
