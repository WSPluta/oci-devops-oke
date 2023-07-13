import { createServer } from "http";
import express from "express";
import helmet from "helmet";
import fetch from "node-fetch";
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

const AUTH_SERVER_SERVICE_HOST = process.env.AUTH_SERVER_SERVICE_HOST;
const AUTH_SERVER_SERVICE_PORT = process.env.AUTH_SERVER_SERVICE_PORT;
logger.info(
  `Auth Server: ${AUTH_SERVER_SERVICE_HOST}:${AUTH_SERVER_SERVICE_PORT}`
);

const JAPP_SERVER_SERVICE_HOST = process.env.JAPP_SERVER_SERVICE_HOST;
const JAPP_SERVER_SERVICE_PORT = process.env.JAPP_SERVER_SERVICE_PORT;
logger.info(
  `Japp Server: ${JAPP_SERVER_SERVICE_HOST}:${JAPP_SERVER_SERVICE_PORT}`
);

logger.info(`Version ${jsonPackage.version}`);

const serverId = short.generate().slice(0, 3);

const app = express();
app.use(helmet());

app.use(express.json());

app.get("/", async (req, res) => {
  logger.info(`GET /`);
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(400).json({ error: true, message: "No Authorization" });
    return;
  }
  const [_, token] = authorization.split(" ");
  const responseAuth = await fetch(
    `http://${AUTH_SERVER_SERVICE_HOST}:${AUTH_SERVER_SERVICE_PORT}/auth`,
    {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    }
  );
  const jsonAuth = await responseAuth.json();
  const responseJapp = await fetch(
    `http://${JAPP_SERVER_SERVICE_HOST}:${JAPP_SERVER_SERVICE_PORT}/japp`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const jsonJapp = await responseJapp.json();
  res.send({
    id: serverId,
    name: jsonPackage.name,
    version: jsonPackage.version,
    message: "hello",
    auth: jsonAuth,
    japp: jsonJapp,
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
