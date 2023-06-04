import { runDatabaseQuery } from ".";
import { COHORT_SUBJECTS_TABLE_NAME, SUBJECT_TABLE_NAME } from "../constants";
import { DicomConvertParameters, Subject, SubjectSessions, SubjectUploadFormat, SubjectsTree } from "../types";

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

const saveSubject = async (subject: string, uploadFormat: SubjectUploadFormat, parameters: DicomConvertParameters | {}, dataTree: SubjectsTree) => {
  await runDatabaseQuery(`
    INSERT INTO ${SUBJECT_TABLE_NAME} (subject, uploadFormat, parameters, dataTree)
    VALUES ('${subject}', '${uploadFormat}', '${JSON.stringify(parameters)}', '${JSON.stringify(dataTree)}');
  `);
}

const getSubjectByName = async (subject: string): Promise<Subject> => {
  const response = await runDatabaseQuery(`
    SELECT * FROM ${SUBJECT_TABLE_NAME} 
    WHERE subject = '${subject}';
  `);
  return formatRowsToSubjects(response.rows)[0] as Subject;
}

const deleteSubjectByName = async (subject: string): Promise<void> => {
   await runDatabaseQuery(`
    DELETE FROM ${COHORT_SUBJECTS_TABLE_NAME} 
    WHERE subject = '${subject}';
  `);
  await runDatabaseQuery(`
    DELETE FROM ${SUBJECT_TABLE_NAME} 
    WHERE subject = '${subject}';
  `);
}

export default {
  get: {
    all: getAllSubjects,
    allNames: getAllSubjectsNames,
    byName: getSubjectByName
  },
  save: saveSubject,
  delete: deleteSubjectByName
}