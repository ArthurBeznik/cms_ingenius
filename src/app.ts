import express from "express";
import courseRoutes from "./routes/courseRoutes";
import { getLogger } from "./utils/logger";
import errorHandler from "./middlewares/errorHandler";
import lessonRoutes from "./routes/lessonRoutes";
import moduleRoutes from "./routes/moduleRoutes";
import swaggerUi from "swagger-ui-express";
import unknownRoute from "./routes/errorRoutes";
import swaggerSpec from "./swagger/swaggerDefinition";
import { BASE_URL, PORT } from "./config/config";

const logger = getLogger(__filename);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "GET") {
    logger.info(`${req.method} ${req.url}`);
  } else {
    logger.info(`${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello, welcome to my CMS-API!" });
});
app.use("/api", courseRoutes);
app.use("/api", moduleRoutes);
app.use("/api", lessonRoutes);
app.use(unknownRoute);

app.use(errorHandler);

export const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Hello: ${BASE_URL}/api/hello`);
  logger.info(`Swagger API Documentation found at ${BASE_URL}/api-docs`);
});

export default app;
