import { Request, Response, NextFunction } from 'express';
import AppError from './appError';
 
function errorHandler(error : AppError, request : Request, response : Response, next : NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Error!';
    response.status(status).send({ status, message });
}
 
export default errorHandler;