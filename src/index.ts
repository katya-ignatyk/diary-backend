import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import { envConfig } from './config';
import { createConnectionWithDB } from './utils/createConectionWithDB';
import errorHandler from './utils/errors/errorHandler';

const port = envConfig.PORT;

(async () => {
    await createConnectionWithDB();
    const app = express();
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Origin',
            envConfig.FE_ADDRESS,
        );
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        next();
    });
    app.use(router);
    app.use(errorHandler);
    app.listen(port, () => {
        console.log(`server started at ${port}`);
    });
})();

