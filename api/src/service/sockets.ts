import { Server, Socket } from "socket.io";
import http from "http";
import { Tail } from 'tail';
import logger from "../core/logger";
import { getJobQueue } from "./jobHandler";

let io: Server | null = null;
export let queueSocket: Socket| null = null;
export let inProgressSocket: Socket| null = null;

export const getQueueSocket = (): Socket | null => {
  return queueSocket;
}

const createInProgressSocket = (logFilePath: string) => {
  const inProgressNamespace = (io as Server).of("/inProgress");
  
  inProgressNamespace.on("connection", (socket) => {
    inProgressSocket = socket;
    const tail = new Tail(logFilePath);
    tail.on("line", function(data: any) {
      logger.magenta(data);
      socket.emit("data", data);
    });
    
    tail.on("error", function(error: any) {
      logger.red('ERROR: ' +  error);
    });

  });
  
}

const setupQueueSocket = () => {
  const queueNamespace = (io as Server).of("/queue");

  queueNamespace.on("connection", (socket) => {
    logger.magenta(`Connection received to queue socket`);

    socket.on("disconnect", () => {
      logger.magenta("Disconnected from queue socket");
      queueSocket = null;
    });

    socket.emit("data", JSON.stringify(getJobQueue()));

    queueSocket = socket;


  });
}

const setup = async (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    }
  });
  setupQueueSocket();

}

export default {
  setup,
  createInProgressSocket
}