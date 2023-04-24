import express from "express";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import { setupCohortsEndpoints } from "../rest/cohorts";
import { setupSubjectsEndpoints } from "../rest/subjects";
import { setupQsmEndpoints } from "../rest/qsm";
import { setupQueueEndpoints } from "../service/queue";
import { SERVER_PORT, TEMP_FILE_DIRECTORY } from "./constants";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors())
  app.options('*', cors());
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
  setupQueueEndpoints(app);
  app.listen(SERVER_PORT);
}
