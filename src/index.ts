import express from 'express';
import router from './routes/';
import {port} from './config';

const app = express();

app.get('/', ( req:express.Request, res:express.Response) => res.send("hello"));

app.listen(port, () => {
    console.log( `server started at ${port}` );
});

app.use(router);