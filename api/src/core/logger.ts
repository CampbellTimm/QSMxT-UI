import logger from "node-color-log";

const red = (text: string) => {
  logger.color('red').log(text);
}

const green = (text: string) => {
  logger.color('green').log(text);
}

const yellow = (text: string) => {
  logger.color('yellow').log(text);
}

const white = (text: string) => {
  logger.log(text);
}

const magenta = (text: string) => {
  logger.color('magenta').log(text);
}

export default {
  red,
  green,
  yellow,
  white,
  magenta
}