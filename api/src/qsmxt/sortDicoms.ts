
import { DicomSortParameters } from "../types";
import { DICOMS_FOLDER } from "../constants";
import logger from "../core/logger";
import { runQsmxtCommand } from ".";

// TODO - DELETE ORIGINALS PARAMETER???
const sortDicoms = async (params: DicomSortParameters) => {
  const { copyPath, usePatientNames, useSessionDates, checkAllFiles } = params
  logger.green("Starting dicom sort");
  let sortDicomCommand = `run_0_dicomSort.py` 
  if (usePatientNames) {
    sortDicomCommand += ` --use_patient_names`;
  }
  if (useSessionDates) {
    sortDicomCommand += ` --use_session_dates`;
  }
  if (checkAllFiles) {
    sortDicomCommand += ` --check_all_files`;
  }
  sortDicomCommand += ` ${copyPath} ${DICOMS_FOLDER}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(sortDicomCommand, completionString);
  logger.green("Finished sorting dicoms");
}

export default sortDicoms;