import { createServer } from "http";
import express from "express";
import helmet from "helmet";
import jsonPackage from "./package.json" assert { type: "json" };
import { createTerminus } from "@godaddy/terminus";
import pino from "pino";
import * as dotenv from "dotenv";
import short from "short-uuid";

dotenv.config({ path: "./config/.env" });

const LOG_LEVEL = process.env.LOG_LEVEL;
const logger = pino({ level: LOG_LEVEL });

const PORT = parseInt(process.env.PORT);
logger.info(`Log Level: ${LOG_LEVEL}`);

const NODE_ENV = process.env.NODE_ENV;
logger.info(`Environment: ${NODE_ENV}`);

logger.info(`Version ${jsonPackage.version}`);

const serverId = short.generate().slice(0, 3);

const app = express();
app.use(helmet());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    id: serverId,
    name: jsonPackage.name,
    version: jsonPackage.version,
    message: "hello",
  });
});

const httpServer = createServer(app);

function onSignal() {
  console.log("server is starting cleanup");
}

async function onHealthCheck() {
  return { name: jsonPackage.name, version: jsonPackage.version };
}

createTerminus(httpServer, {
  signal: "SIGINT",
  healthChecks: { "/healthz": onHealthCheck },
  onSignal,
});

httpServer.listen(PORT, () =>
  logger.info(`Server ${serverId} listening on port ${PORT}`)
);
