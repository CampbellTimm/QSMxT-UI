
import logger from "../core/logger";
import path from "path";
import { BIDS_FOLDER, QSM_FOLDER } from "../constants";
import { runQsmxtCommand } from ".";

const getQsmCmdLineOptions = (subject: string, premade: string = "fast") => {
  return `--premade=${premade} --auto_yes --subject_pattern ${subject}`
}

export const runQsmPipeline = async (id: string, subject: string, premade: string) => {
    logger.green(`Running QSM Pipeline on ${subject}`);
    const subjectFolder = path.join(QSM_FOLDER, subject);
    const resultFolder = path.join(subjectFolder, `/${id}`);
    const qsmxtCmmand = `run_2_qsm.py ${BIDS_FOLDER} ${resultFolder} ${getQsmCmdLineOptions(subject, premade)}`
    const completionString = 'INFO: Finished';
    await runQsmxtCommand(qsmxtCmmand, completionString);
    logger.green(`Finished running QSM Pipeline on ${subject}`);
}

export default runQsmPipeline;