import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import { setupCohortsEndpoints } from "../rest/cohorts";
import { setupSubjectsEndpoints } from "../rest/subjects";
import { setupQsmEndpoints } from "../rest/qsm";
import { setuJobsEndpoints } from "../rest/jobs";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER, SERVER_PORT, TEMP_FILE_DIRECTORY } from "./constants";
import http from "http";
import logger from "./logger";
import fs from "fs";
import sockets from "../service/sockets";

const wipeLogFiles = (folder: string) => {
  const files = fs.readdirSync(folder);
  files.forEach(fileName => {
    if (fileName.startsWith('log_') || fileName.startsWith('references')) {
      fs.unlinkSync(path.join(folder, fileName));
    }
  })
}

const setup = () => {
  [QSM_FOLDER, BIDS_FOLDER, DICOMS_FOLDER].forEach(wipeLogFiles)
}

export const createServer = async () => {
  setup();
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
  setupCohortsEndpoints(app);
  setupSubjectsEndpoints(app);
  setupQsmEndpoints(app);
  setuJobsEndpoints(app);
  const server = http.createServer(app);
  await sockets.setup(server);
  server.listen(SERVER_PORT, () => {
    logger.green(`Server started on port ${SERVER_PORT}`);
  });
}
