import express, { Express, Router } from 'express';
import bodyParser from 'body-parser';
import { container, setupContainer } from './config/awilixContainer';
import { envConfig } from './config';
import errorHandler from './utils/errors/errorHandler';

interface IAppDependencies {
    router : Router;
}

setupContainer()
    .then(() => {
        const server = container.resolve<App>('app');

        server.start();
    }); 

export class App {
    private app : Express;
    private router : Router
    private readonly port = envConfig.PORT;

    constructor (dep : IAppDependencies) {
        this.app = express();
        this.router = dep.router;

        this.start = this.start.bind(this);
    }

    start () {
        this.app.use(bodyParser.json());
        this.app.use((req, res, next) => {
            res.header(
                'Access-Control-Allow-Origin',
                envConfig.FE_ADDRESS,
            );
            res.header('Access-Control-Allow-Headers', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
            next();
        });
        this.app.use(this.router);
        this.app.use(errorHandler);
        this.app.listen(this.port, () => {
            console.log(`server started at ${this.port}`);
        });
    }
}

