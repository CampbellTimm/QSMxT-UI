import { ChildProcessWithoutNullStreams } from "child_process";
import { createChild, setupListeners } from "../util";
import { Express } from "express";
const { v4 } = require('uuid') ;
import fs from "fs-extra";
import path from "path";
import decompress from "decompress";
import { addToQueue } from "../service/queue";
import qsmxtCmdLine from "../service/qsmxtCmdLine";

const uploadDicoms = async (req: any, res: any) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files.folderzip)

  console.log("COPYING")
  await req.files.folderzip.mv(path.join(process.cwd(), `./temp/zippy.zip`))

  await decompress(path.join(process.cwd(), `./temp/zippy.zip`), path.join(process.cwd(), `./temp/decompressed`));
  const rootFolder = fs.readdirSync(path.join(process.cwd(), `./temp/decompressed`))[0];

  console.log(rootFolder);


  const dicomSortInput = path.join(process.cwd(), `./temp/decompressed/${rootFolder}`);
  const dicomSortOutput = path.join(process.cwd(), `./public/qsmxt/dicom}`);

  addToQueue(
    "Dicom Sort",
    async () => qsmxtCmdLine.sortDicoms(dicomSortInput, dicomSortOutput)
  )

  res.status(200).send();
}


export const setupDicomEndpoints = (app: Express) => {
  app.post('/dicoms/upload', uploadDicoms)
}