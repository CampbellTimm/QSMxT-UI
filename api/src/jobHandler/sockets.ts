import { Server, Socket } from "socket.io";
import http from "http";
import logger from "../util/logger";
import fs from "fs";
import { Job } from "../types";

let io: Server | null = null;
let notificationSocket: Socket| null = null;
let backedUpNotifications: Job[] = [];

export const getNotificationSocket = (): Socket => {
  return notificationSocket as Socket;
}

let inProgressNamespace: any = null
let notificationNameSpace: any = null

let currentLogFile: any = null;

const createInProgressSocket = (logFilePath: string) => {
  currentLogFile = logFilePath;
  inProgressNamespace.on("connection", (socket: any) => {
    logger.magenta('Connection recieved to "In Progress" Socket');
    let interval: any = null;
      interval = setInterval(() => {
        // TODO - switch to watch file
        const logData = fs.readFileSync(currentLogFile, { encoding: 'utf-8'});
        socket.emit("data", logData);
      }, 1000);
    socket.on('disconnect', () => {
      logger.magenta('Disconnected from "In Progress" Socket');
      clearInterval(interval);
    });
  });
}

const createNotificationSocket = () => {
  notificationNameSpace.on("connection", (socket: any) => {
    logger.magenta('Connection recieved to "Notification" Socket');
    notificationSocket = socket;
    if (backedUpNotifications.length) {
      backedUpNotifications.forEach((backedUpJob: Job) => {
        socket.emit("data", JSON.stringify({ job: backedUpJob }));
      });
      backedUpNotifications = [];
    }
    socket.on('disconnect', () => {
      logger.magenta('Disconnected from "In Notification" Socket');
    });
  });
}

const sendJobAsNotification = async (job: Job) => {
  const notificationSocket = getNotificationSocket();
  if (notificationSocket) {
    notificationSocket.emit("data", JSON.stringify({ job }));
  } else {
    backedUpNotifications.push(job);
  }
}

const setup = async (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    }
  });
  inProgressNamespace = (io as Server).of("/inProgress");
  notificationNameSpace = (io as Server).of("/notifications");
  createNotificationSocket();
}

export default {
  setup,
  createInProgressSocket,
  sendJobAsNotification
}