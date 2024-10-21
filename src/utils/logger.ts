import { createLogger, format, transports } from "winston";
import path from "path";

const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, fileName, timestamp }) => {
  return `[${timestamp}] [${level}] [${fileName}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(
    format.colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/app.log",
    }),
  ],
});

export const getLogger = (filename: string) => {
  return logger.child({ fileName: path.basename(filename) });
};
