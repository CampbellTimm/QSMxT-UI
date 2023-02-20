import { ChildProcessWithoutNullStreams } from "child_process";
import { createChild, setupListeners } from "./util";
import { Express } from "express";
const { v4 } = require('uuid') ;
import fs from "fs-extra";
import path from "path";
import decompress from "decompress";



export const convertDicoms = async (child: ChildProcessWithoutNullStreams) => {
  console.log('Converting Dicoms');

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      if (data.includes('Finished!')) {
        resolve(null);
      }
    });
    child.stdin.write("python3 /opt/QSMxT/run_1_dicomConvert.py 00_dicom 01_bids\n")
  })

  console.log('Converted Dicoms')
}


