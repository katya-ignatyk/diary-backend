import nodemailer from 'nodemailer';
import mailGen from 'mailgen';
import { envConfig } from '../config';

export class EmailService {
    private static instance : EmailService;

    public static get Instance() : EmailService {
        if (!EmailService.instance)
            EmailService.instance = new EmailService();
        return EmailService.instance;
    } 

    private async send<T>(email : string, info : T) : Promise<T> {
        const baseInfo = {
            from: 'katuxa.ignatuk@gmail.com',
            to: email
        };
        return await this.Transport.sendMail({ ...baseInfo, ...info });
    }

    private generateEmailTemplate(email : string) : string {
        const mailGenerator = new mailGen({
            theme: 'default',
            product: {
                name: 'News', // !add styles here!
                link: 'localhost:3000',
            },
        });
        
        const emailContent = {
            body: {
                name: email,
                intro: 'Welcome to email verification',
                action: {
                    instructions: 'Please click the button below to verify your account',
                    button: {
                        color: '#33b5e5',
                        text: 'Verify account',
                        link: 'localhost:3000/confirm',
                    },
                },
            },
        };
        
        return mailGenerator.generate(emailContent);
    }

    private get Transport() {
        return nodemailer.createTransport({
            service: 'SendGrid',
            host: 'smtp.ethereal.email', 
            port: 587,
            auth: {
                user: envConfig.SG_USERNAME,
                pass: envConfig.SG_PASSWORD
            }
        });
    }

    public async sendVerificationEmail(email : string) {
        const info = {
            subject: 'Registration confirm',
            html: this.generateEmailTemplate(email),
        };
        await this.send(email, info);
    }
}