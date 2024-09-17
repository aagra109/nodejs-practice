import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDirectory = path.join(__dirname, "logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
    }),

    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join(logDirectory, "warn.log"),
      level: "warn",
    }),

    new winston.transports.File({
      filename: path.join(logDirectory, "info.log"),
      level: "info",
    }),
  ],
});

export default logger;
