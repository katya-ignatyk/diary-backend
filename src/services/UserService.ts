import { getRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { UserExistenceError, UserNotFoundError, InvalidPasswordError, UserNotVerifiedError } from '../utils/errors/userErrors';
import { UserStatus } from '../models/User';
import { BaseService } from './baseService';

export class UserService extends BaseService<User>{
    private static instance : UserService;
    private readonly saltRounds = 10;

    constructor() {
        super(getRepository(User));
    }

    public static get Instance() : UserService {
        if (!UserService.instance)
            UserService.instance = new UserService();
        return UserService.instance;
    }

    public async createUser(email : string, password : string, username : string) {
        const user = await this.findOne({ email });

        if (user) {
            throw new UserExistenceError();
        }
        const hashedPassword = await this.hashPassword(password);
        return await this.save({
            email,
            password: hashedPassword,
            username,
            status: UserStatus.PENDING
        });
    }

    public async verifySignUp(id : number) {
        await this.update({ id }, { status: UserStatus.VERIFY });
        return this.findOne({ id });
    }

    public async authorizeUser(inputEmail : string, password : string) {
        const user = await this.checkEmailExistence(inputEmail);
        if (user.status !== UserStatus.VERIFY) {
            throw new UserNotVerifiedError();
        }

        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            throw new InvalidPasswordError();
        }
         
        return user;
    }

    public async checkEmailExistence(email : string) {
        const user = await this.findOne({ email });

        if (!user) {
            throw new UserNotFoundError();
        }

        return user;
    }

    public async resetPassword(password : string, id : number) {
        const user = await this.findOne({ id });

        if (!user) {
            throw new UserNotFoundError();
        }

        const hashedPassword = await this.hashPassword(password);
        await this.update({ id }, { password: hashedPassword });
    }

    public getUserById(id : number) {
        return this.findOne({ id });
    }

    private hashPassword(password : string) {
        return bcrypt.hash(password, this.saltRounds);
    }

}