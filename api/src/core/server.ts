import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER, SERVER_PORT, TEMP_FILE_DIRECTORY } from "../constants";
import http from "http";
import logger from "./logger";
import fs from "fs";
import sockets from "./sockets";
import { setupRestApiEndpoint } from "../rest";

const wipeLogFiles = (folder: string) => {
  const files = fs.readdirSync(folder);
  files.forEach(fileName => {
    if (fileName.startsWith('log_') || fileName.startsWith('references')) {
      fs.unlinkSync(path.join(folder, fileName));
    }
  })
}

export const createServer = async () => {
  [QSM_FOLDER, BIDS_FOLDER, DICOMS_FOLDER].forEach(wipeLogFiles);
  const app = express();
  app.use(express.json());
  app.use(cors())
  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: TEMP_FILE_DIRECTORY
    })
  );
  setupRestApiEndpoint(app);
  const server = http.createServer(app);
  await sockets.setup(server);
  server.listen(SERVER_PORT, () => {
    logger.green(`Server started on port ${SERVER_PORT}`);
  });
}
