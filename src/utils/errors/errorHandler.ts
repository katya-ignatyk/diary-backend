import { Request, Response } from 'express';
import AppError from './AppError';
 
function errorHandler(error : AppError, request : Request, response : Response) {
    const status = error.status || 500;
    const message = error.message || 'Error!';
    response
        .send({
            status,
            message,
        });
}
 
export default errorHandler;