import logger from "node-color-log";

export const logRed = (text: string) => {
  logger.color('red').log(text);
}

export const logGreen = (text: string) => {
  logger.color('green').log(text);
}

export const logYellow = (text: string) => {
  logger.color('yellow').log(text);
}