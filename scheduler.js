import cron from "node-cron";
import sendEmail from "./sendEmail.js";

const scheduledTask = cron.schedule("0 * * * *", sendEmail);

scheduledTask.start();
