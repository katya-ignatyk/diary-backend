import { NextFunction, Request, Response } from 'express';

interface IController {
  (req : Request, res : Response, next : NextFunction) : Promise<void>;
}

export function catchAsync(fn : IController) {
    return (req : Request, res : Response, next : NextFunction) => {
        fn(req, res, next).catch((err : Error) => next(err));
    };
}