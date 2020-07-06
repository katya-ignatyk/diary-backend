import express from 'express';
import router from './routes/';
import { envConfig } from './config/';
import bodyParser from "body-parser";
import { createConnectionWithDB } from './utils/CreateConectionWithDB';

const port = envConfig.port;

(async () => {
    await createConnectionWithDB();
    const app = express();
    app.listen(port, () => {
        console.log( `server started at ${port}` );
    });
    app.use(bodyParser.json());
    app.use(router);    
})();
