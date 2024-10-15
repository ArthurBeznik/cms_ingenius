import { createLogger, format, transports } from "winston";
import path from "path"; // To handle file paths

const { combine, timestamp, printf } = format;

// Custom format that includes the fileName in the log output
const myFormat = printf(({ level, message, fileName, timestamp }) => {
  return `[${timestamp}] [${level}] [${fileName}]: ${message}`;
});

// Create the logger
export const logger = createLogger({
  level: "info",
  format: combine(
    format.colorize(), // Adds color to the output in the console
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Adds a formatted timestamp
    myFormat // Use the custom format
  ),
  transports: [
    new transports.Console(),
    // new transports.File({
    //   filename: 'logs/app.log'
    // })
  ],
});

// Function to get a logger that injects the current file's name into the log messages
export const getLogger = (filename: string) => {
  return logger.child({ fileName: path.basename(filename) });
};
