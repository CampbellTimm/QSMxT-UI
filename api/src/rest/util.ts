import logger from "../core/logger";
import { Request, Response } from "express";

export const unknownErrorHandler = (func: (request: Request, response: Response) => Promise<any>) => async (request: Request, response: Response) => {
  try {
    await func(request, response);
  } catch (err) {
    logger.red(`Error occured in: ${func.name}`);
    if ((err as any).message) {
      logger.red((err as Error).message);
    } else {
      logger.red(err as any);
    }
    response.statusMessage = "Unknown error occured";
    response.status(500).send();
  }
}