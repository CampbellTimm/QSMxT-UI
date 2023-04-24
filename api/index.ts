import { SERVER_PORT } from "./src/core/constants";
import { createServer } from "./src/core/createServer";
import { logGreen } from "./src/util/logger";

createServer();

logGreen(`Server started on port ${SERVER_PORT}`);