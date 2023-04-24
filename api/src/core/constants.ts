import path from "path";

const projectRootPath = process.cwd();

export const SERVER_PORT = 4000;
export const TEMP_FILE_DIRECTORY = path.join(projectRootPath, './tmp');
export const DICOMS_FOLDER = path.join(projectRootPath, `./public/qsmxt/dicoms`);
export const COHORTS_FILE_PATH = path.join(projectRootPath, "./public/qsmxt/cohorts.json");
export const BIDS_FOLDER = path.join(projectRootPath, `./public/qsmxt/bids`);
export const QSM_FOLDER = path.join(projectRootPath, `./public/qsmxt/qsm`);
export const COHORTS_TREE_PATH = path.join(process.cwd(), './public/qsmxt/cohorts.json');