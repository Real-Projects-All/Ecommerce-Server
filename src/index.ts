import app from "app";
import { logger } from "config";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
