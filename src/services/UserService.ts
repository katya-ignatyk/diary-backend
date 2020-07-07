import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { UserExistsError } from '../utils/errors/UserErrors';

export class UserService{
    private static instance : UserService;
    private readonly saltRounds = 10;
    private readonly userRepository = getRepository(User);

    public static get Instance() : UserService {
        if (!UserService.instance)
            UserService.instance = new UserService();
        return UserService.instance;
    } 
    
    private async hashPassword(password : string) {
        return bcrypt.hash(password, this.saltRounds);
    }

    public async createUser(email : string, password : string) {
        await this.checkUserExistence(email);
        const hashedPassword = await this.hashPassword(password);

        return this.userRepository.save({
            email,
            password: hashedPassword
        });  
    }

    private async checkUserExistence(email : string){
        const user = await this.userRepository.find({ email });

        if(user.length) {
            throw new UserExistsError(email);
        }
            
    }
}