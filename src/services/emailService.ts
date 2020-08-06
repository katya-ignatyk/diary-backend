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

    private send<T>(email : string, info : T) : Promise<T> {
        const baseInfo = {
            from: 'news@gmail.com',
            to: email
        };
        return this.Transport.sendMail({ ...baseInfo, ...info });
    }

    private generateVerificationEmail(username : string, accessToken : string) : string {
        const mailGenerator = new mailGen({
            theme: 'default',
            product: {
                name: 'News',
                link: envConfig.FE_ADDRESS,
            },
        });

        const emailContent = {
            body: {
                name: username,
                intro: 'Welcome to email verification',
                action: {
                    instructions: 'Please click the button below to verify your account',
                    button: {
                        color: '#33b5e5',
                        text: 'Verify account',
                        link: `${envConfig.FE_ADDRESS}/signUp/verify?token=${accessToken}`,
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

    public sendVerificationEmail(email : string, username : string, accessToken : string) {
        const info = {
            subject: 'Registration confirm',
            html: this.generateVerificationEmail(username, accessToken),
        };
        return this.send(email, info);
    }
}