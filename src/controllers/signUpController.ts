import {Request, Response, NextFunction} from "express";
import {catchAsync} from '../utils/errors/catchAsync';
import {validateUserData} from '../utils/validators/userValidation';
import {UserService} from '../services/UserService';

export const addUser = catchAsync(async (req : Request, res : Response, next :  NextFunction) => {

    const {email, password} = req.body;
    await validateUserData(email, password);
    const UserServiceInstance = UserService.Instance;
    await UserServiceInstance.isUserArleadyExists(email);
    await UserServiceInstance.createUser(email, password)
    return res.sendStatus(200);

})