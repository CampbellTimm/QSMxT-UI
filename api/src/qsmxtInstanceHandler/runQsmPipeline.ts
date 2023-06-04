
import logger from "../util/logger";
import path from "path";
import { BIDS_FOLDER, QSM_FOLDER } from "../constants";
import { runQsmxtCommand } from ".";
import fs from "fs";

const getQsmCmdLineOptions = (subject: string, sessions: string[], runs: string[], pipelineConfig: string) => {
  let options =  `--premade=${pipelineConfig} --auto_yes --subject_pattern ${subject}`;
  if (sessions.length) {
    options += ` --sessions ${sessions.join(',')}`
  }
  if (runs.length) {
    options += ` --runs ${runs.join(',')}`
  }
  return options;
}

export const runQsmPipeline = async (id: string, subjects: string[], sessions: string[], runs: string[], pipelineConfig: string) => {
    logger.green(`Running QSM Pipeline on ${subjects.join(', ')}`);
    const resultFolder = path.join(QSM_FOLDER, `/${id}`);
    const logFilePath = path.join(resultFolder, `ALL.log`); 
    fs.writeFileSync(logFilePath, '');
    for (let subject of subjects) {
      const qsmxtCmmand = `run_2_qsm.py ${BIDS_FOLDER} ${resultFolder} ${getQsmCmdLineOptions(subject, sessions, runs, pipelineConfig)}`;
      const completionString = 'INFO: Finished';
  
      await runQsmxtCommand(qsmxtCmmand, completionString, logFilePath);
    }

    // const qs/*  */mxtCmmand2 = `run_5_analysis.py --labels_file /opt/QSMxT/aseg_labels.csv --qsm_files ${resultFolder}/qsm_final/*/*.nii --output_dir ${resultFolder}/analysis`;
    // await runQsmxtCommand(qsmxtCmmand2, completionString);

    logger.green(`Finished running QSM Pipeline on ${subjects.join(', ')}`);

    // save the configuration JSON used
}

export default runQsmPipeline;