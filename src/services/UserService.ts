import { getRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { UserExistenceError } from '../utils/errors/userErrors';
import { envConfig } from '../config';
import { UserStatus } from '../models/User';
import { JwtService } from './jwtService';
import { BaseService } from './baseService';

export class UserService extends BaseService<User>{
    private static instance : UserService;
    private readonly saltRounds = 10;

    constructor(repository : Repository<User>) {
        super(repository);
    }

    public static get Instance() : UserService {
        const userRepository = getRepository(User);
        if (!UserService.instance)
            UserService.instance = new UserService(userRepository);
        return UserService.instance;
    }

    public async createUser(email : string, password : string, username : string) {
        await this.checkUserExistence(email);
        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.save({
            email,
            password: hashedPassword,
            username,
            status: UserStatus.PENDING
        });
        return JwtService.generateToken(newUser.id, envConfig.JWT_DEFAULT_SECRET, envConfig.JWT_DEFAULT_EXPIRESIN);
    }

    public verifySignUp(id : number) {
        this.update({ id }, { status: UserStatus.VERIFY });
        return this.findOne({ id });
    }

    private async hashPassword(password : string) {
        return bcrypt.hash(password, this.saltRounds);
    }

    private async checkUserExistence(email : string) {
        const user = await this.findOne({ email });

        if (user) {
            throw new UserExistenceError();
        }
    }
}