import { StringLiteral } from "typescript";
import { runQsmxtCommand } from ".";
import { ANALYSIS_FOLDER, BIDS_FOLDER, QSM_FOLDER, SEGMENTATION_FOLDER } from "../constants";
import logger from "../util/logger";
import path from "path";
import csvtojson from "csvtojson";
import fs from "fs"

const runSegmentation = async (id: string, subjects: string[], linkedQsmJob: string) => {
  logger.green(`Running Segmentation on ${subjects.join(', ')}`);

  const qsmResultFolder =  path.join(QSM_FOLDER, linkedQsmJob);

  const completionString = 'INFO: Finished';

  // TODO - add sessions, runs and other params
  for (let subject of subjects) {
    const segmentationCommand = `run_3_segment.py ${BIDS_FOLDER} ${qsmResultFolder} --subject_pattern ${subject}`;
    await runQsmxtCommand(segmentationCommand, completionString);
  }

  logger.green(`Finished running Segmentation on ${subjects.join(', ')}`);

  logger.green(`Running analysis on ${subjects.join(', ')}`);

  const analysisCommand = `run_5_analysis.py --labels_file /opt/QSMxT/aseg_labels.csv --segmentations ${qsmResultFolder}/qsm_segmentations/*.nii --qsm_files ${qsmResultFolder}/qsm_final/*/*.nii --output_dir ${qsmResultFolder}`;
  await runQsmxtCommand(analysisCommand, completionString);
  logger.green(`Finished analysis on ${subjects.join(', ')}`);

  const results: any = {};
  await Promise.all(fs.readdirSync(qsmResultFolder).map(async (file) => {
 
    if (file.endsWith('.csv')) {
      const sessionNumber = (new RegExp("(?<=ses-).*(?=_run)", "g").exec(file) || [])[0] as string;
      const runNumber = (new RegExp("(?<=_run-)\\d*(?=_)", "g").exec(file) || [])[0] as string;
      const subject = (new RegExp(".*(?=_ses)", "g").exec(file) || [])[0] as string;
      const csvPath = path.join(qsmResultFolder, file);
      const json: any = await csvtojson().fromFile(csvPath);
      if (!results[subject]) {
        results[subject] = { sessions: {} }
      }
      if (!results[subject].sessions[sessionNumber]) {
        results[subject].sessions[sessionNumber] = { runs: {} }
      }
      results[subject].sessions[sessionNumber].runs[runNumber] = json;
    }
  }));

  fs.writeFileSync(path.join(qsmResultFolder, 'results.json'), JSON.stringify(results, null, 2), { encoding: 'utf-8' });



}

export default runSegmentation;