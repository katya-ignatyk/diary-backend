import { Request, Response } from 'express';
import { catchAsync } from '../utils/errors/catchAsync';
import { JwtService } from '../services';
import { envConfig } from '../config';

export const verifySignUp = catchAsync(async (req : Request, res : Response) => {
    const token = req.params.token;
    const verifiedAccessToken = await JwtService.verifyAndDecodeToken(token);
    const refreshToken = JwtService.generateToken(verifiedAccessToken.id, envConfig.JWT_REFRESH_SECRET, '3 days');
    res.status(200).send({ refreshToken, accessToken : verifiedAccessToken });
});