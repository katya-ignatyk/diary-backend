import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { UserExistenceError } from '../utils/errors/userErrors';
import { envConfig } from '../config';
import { UserStatus } from '../models/User';
import { JwtService } from './jwtService';

export class UserService {
    private static instance : UserService;
    private readonly saltRounds = 10;
    private readonly userRepository = getRepository(User);

    public static get Instance() : UserService {
        if (!UserService.instance)
            UserService.instance = new UserService();
        return UserService.instance;
    }

    public async createUser(email : string, password : string, username : string) {
        await this.checkUserExistence(email);
        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.userRepository.save({
            email,
            password: hashedPassword,
            username,
            status: UserStatus.PENDING
        });
        return JwtService.generateToken(newUser.id, envConfig.JWT_DEFAULT_SECRET, envConfig.JWT_DEFAULTT_EXPIRESIN);
    }

    public async getUserById(id : number) {
        return this.userRepository.findOne(id);
    }

    public async updateUserStatus(id : number) {
        return this.userRepository.update({ id }, { status: UserStatus.VERIFY });
    }

    private async hashPassword(password : string) {
        return bcrypt.hash(password, this.saltRounds);
    }

    private async checkUserExistence(email : string) {
        const user = await this.userRepository.find({ email });

        if (user.length) {
            throw new UserExistenceError();
        }
    }
}