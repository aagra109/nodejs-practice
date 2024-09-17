import nodemailer from "nodemailer";
import logger from "./logger.js";

const sendEmail = () => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const options = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: "Test Email",
    text: "This is a test email.",
  };

  transporter.sendMail(options, (error, info) => {
    logger.info("Sending email...");
    if (error) logger.error(error);
    else logger.info(`Email sent: ${info.response}`);
  });
};

export default sendEmail;
