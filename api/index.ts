import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import fs from "fs";
import express from "express";
import path from "path";
import cors from "cors";


// const express = require('express')
// const child = spawn('ls', ['-l']);
// var path = require('path');
// const cors = require('cors');
const fileUpload = require("express-fileupload");
const { v4 } = require('uuid') ;

const dirTree = require("directory-tree");
const { join } = require('path');
const openPage = require('open');


openPage('http://form-ui.s3-website-ap-southeast-2.amazonaws.com/login');

const setupListeners = (child: ChildProcessWithoutNullStreams, reject: (reason?: any) => void) => {
  child.stdout.removeAllListeners();
  child.stderr.removeAllListeners();
  child.removeAllListeners();
  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    reject(data)
  });
  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
    reject(error.message)
  });
  
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

const createChild = async () => {
  console.log('Booting')
  const child = spawn('/neurocommand/local/fetch_and_run.sh', ['qsmxt',  '1.1.10' , '20220302']);

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      if (data.includes('----------------------------------')) {
        resolve(null);
      }
    });
  })

  console.log('booted');
  
  return child;
}

const sortDicoms = async (child: ChildProcessWithoutNullStreams) => {
  console.log('Sorting Dicoms')
  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      if (data.includes('done sorting dicoms')) {
        resolve(null);
      }
    });
    child.stdin.write("cd /neurodesktop-storage/qsmxt-demo\n")
    child.stdin.write("python3 /opt/QSMxT/run_0_dicomSort.py /neurodesktop-storage/qsmxt-demo/dicoms 00_dicom\n")
  })
  console.log('Sorted Dicoms')
}

const convertDicoms = async (child: ChildProcessWithoutNullStreams) => {
  console.log('Converting Dicoms');

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      // console.log(data.toString());
      if (data.includes('Finished!')) {
        resolve(null);
      }
      // if (data.includes('Finished!')) {

      // }
    });
    child.stdin.write("python3 /opt/QSMxT/run_1_dicomConvert.py 00_dicom 01_bids\n")
  })

  console.log('Converted Dicoms')
}

const qsmPipeline = async (child: ChildProcessWithoutNullStreams) => {
  console.log('Running QSM Pipeline');

  
  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {

      console.log(data.toString()); 
      if (data.includes('Running 0 tasks, and 0 jobs ready')) {
        resolve(null);
      }

    });
    child.stdin.write("python3 /opt/QSMxT/run_2_qsm.py 01_bids 02_qsm_output\n")
  })

  console.log('Finished QSM Pipeline');
}

var app = express();
app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  fileUpload()
);

app.get('/bids', async (req, res) => {
  // const tree = dirTree(path.join(__dirname, `./public/qsmxt/bids`));
  // console.log(tree);

  
  type Session = {
    id: string,
    section: string,
    metadata: any
  }

  const sessions: Session[] = [];

  const folder = path.join(__dirname, `./public/qsmxt/bids`);
  const bidsFolders: string[] = fs.readdirSync(folder);

  console.log(bidsFolders);

  const relevantFiles: any = bidsFolders.map(bidsFolder => {
    const files = fs.readdirSync(path.join(folder, bidsFolder, './ses-1/anat'));
    return files
    // const data = 
    // sessions.push(files.map(fileName => {
    //   if (fileName.includes('.json')) {
    //     return {
    //       fileName,
    //       data: 
    //     }
    //   }
    //   return fs.readFileSync(path.join(folder, bidsFolder, './ses-1/anat', fileName), { encoding: 'utf-8' });
    // }))
  });

  // console.log(y);

  relevantFiles.forEach((files: string[]) => {
    const images: string[] = Array.from(new Set(files.map(file => file.split('.')[0])))
    console.log(images);


    images.forEach(image => {
    const id = image.split('_ses-1')[0];

      sessions.push({
        id,
        section: image.split('_ses-1')[1].split('_run-1_')[1],
        metadata: JSON.parse(fs.readFileSync(path.join(folder, id, 'ses-1/anat', `${image}.json`), { encoding: 'utf-8' }))
      });
    })
   
  })


  console.log(sessions);
  const sessionObj: {[key: string]: Session[]} = {};

  sessions.forEach(session => {
    if (!sessionObj[session.id]) {
      sessionObj[session.id] = [session]
    } else {
      sessionObj[session.id].push(session)
    }
  })

  res.status(200).send(sessionObj);

})

app.post('/upload', async (req: any, res) => {
  // console.log(req.files); // the uploaded file object

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files.uploadFiles)

  const id = v4();

  const folderPath = path.join(__dirname, `./public/qsmxt/dicom/${id}`);

  fs.mkdirSync(folderPath);

  // req.files.uploadFiles.forEach(file => {

    // console.log(file);

    // file.mv(path.join(folderPath, file.name), (err) => {
    //   if (err) {
    //     return res.status(500).send(err);
    //   }
    //   return res.send({ status: "success" });
    // });

      fs.writeFileSync(path.join(folderPath, req.files.uploadFiles.name), req.files.uploadFiles.data, { encoding: 'utf-8' })

  // })



  // const child = await createChild();

  // await sortDicoms(child);
  // await convertDicoms(child);

  // child.kill();
  res.status(200).send();
})

app.get('/all', async (req, res) => {


  const child = await createChild();

  await sortDicoms(child);
  await convertDicoms(child);
  await qsmPipeline(child);




  child.kill();

  res.send('Hello World')
})

app.listen(4000)

console.log('Started');

// (async () => {



// })()



