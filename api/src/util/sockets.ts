import { Server, Socket } from "socket.io";
import http from "http";
import { Tail } from 'tail';
import logger from "./logger";
import { getJobQueue } from "../jobHandler";
import fs from "fs";

let io: Server | null = null;
export let queueSocket: Socket| null = null;
export let inProgressSocket: Socket| null = null;

export const getQueueSocket = (): Socket | null => {
  return queueSocket;
}

let inProgressNamespace: any = null

let currentLogFile: any = null;

const createInProgressSocket = (logFilePath: string) => {
  currentLogFile = logFilePath;
  inProgressNamespace.on("connection", (socket: any) => {
    logger.magenta('Connection recieved to "In Progress" Socket');
    let interval: any = null;
      interval = setInterval(() => {


        // TODO - switch to watch file
        const logData = fs.readFileSync(currentLogFile, { encoding: 'utf-8'});
        console.log(currentLogFile);
  
  
        socket.emit("data", logData);
  
      }, 1000);


    socket.on('disconnect', () => {
      logger.magenta('Disconnected rfrom "In Progress" Socket');
      clearInterval(interval);
    });
  });
}

const setupQueueSocket = () => {
  return;
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
  inProgressNamespace = (io as Server).of("/inProgress");

  setupQueueSocket();

}

export default {
  setup,
  createInProgressSocket
}