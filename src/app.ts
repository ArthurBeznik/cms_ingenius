import express from "express";
import courseRoutes from "./routes/courseRoutes";
import { getLogger } from "./utils/logger";
import errorHandler from "./middlewares/errorHandler";

const logger = getLogger(__filename);

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}`);
  next();
});

app.use("/api", courseRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  logger.info("Server running on port 3000");
});
