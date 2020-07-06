import {Request, Response, NextFunction} from 'express';

interface IController {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export function catchAsync(fn : IController) {
    return (req : Request, res : Response, next : NextFunction) => {
      fn(req, res, next).catch((err: Error) => next(err));
    };
};