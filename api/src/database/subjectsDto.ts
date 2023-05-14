import { runDatabaseQuery } from ".";
import { SUBJECT_TABLE_NAME } from "../constants";
import { DicomConvertParameters, Subject, SubjectSessions, SubjectUploadFormat } from "../types";

const formatRowsToSubjects = (subjects: any[]): Subject[] => {
  return subjects.map(subject => ({
    subject: subject.subject,
    uploadFormat: subject.uploadformat,
    parameters: JSON.parse(subject.parameters),
    dataTree: JSON.parse(subject.datatree)
  })) as Subject[]
}

const getAllSubjects = async (): Promise<Subject[]> => {
  const response = await runDatabaseQuery(`
    SELECT * FROM ${SUBJECT_TABLE_NAME} 
    ORDER BY subject ASC;
  `);
  return formatRowsToSubjects(response.rows) as Subject[];
}

const getAllSubjectsNames = async () => {
  const response = await runDatabaseQuery(`
    SELECT subject FROM ${SUBJECT_TABLE_NAME} 
    ORDER BY subject ASC;
  `);
  return response.rows.map(row => row.subject);
}

const saveSubject = async (subject: string, uploadFormat: SubjectUploadFormat, parameters: DicomConvertParameters, dataTree: SubjectSessions) => {
  await runDatabaseQuery(`
    INSERT INTO ${SUBJECT_TABLE_NAME} (subject, uploadFormat, parameters, dataTree)
    VALUES ('${subject}', '${uploadFormat}', '${JSON.stringify(parameters)}', '${JSON.stringify(dataTree)}');
  `);
}

export default {
  get: {
    all: getAllSubjects,
    allNames: getAllSubjectsNames
  },
  save: saveSubject
}