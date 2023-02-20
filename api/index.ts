import express from "express";
import path from "path";
import cors from "cors";
import { createChild, setupListeners } from "./src/util";
import { convertDicoms } from "./src/dicoms";
import { setupBidsEndpoints } from "./src/bids";
import { setupCohortsEndpoints } from "./src/cohorts";
import { qsmPipeline, setupQsmEndpoints } from "./src/qsm";
import { setupSubjectsEndpoints } from "./src/subjects";
import { setupQueueEndpoints } from "./src/service/queue";
import { setupDicomEndpoints } from "./src/rest/api";

const fileUpload = require("express-fileupload");

// openPage('http://form-ui.s3-website-ap-southeast-2.amazonaws.com/login');

var app = express();
app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  fileUpload({
    // useTempFiles: true,
    // tempFileDir: path.join(__dirname, './tmp')
  })
);

setupBidsEndpoints(app);
setupCohortsEndpoints(app);
setupSubjectsEndpoints(app);
setupDicomEndpoints(app);
setupQsmEndpoints(app);
setupQueueEndpoints(app);



app.listen(4000)

console.log('Started');


