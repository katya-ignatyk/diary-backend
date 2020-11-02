import { Request, Response, NextFunction } from 'express';
import AppError from './appError';
 
function errorHandler(error : AppError, request : Request, response : Response, next : NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Error!';
    const code = error.code || null;
    return response.status(status).send({ status, message, code });
}
 
export default errorHandler;