import express from 'express';
import router from './routes/index';
import dotenv from 'dotenv';

const app:express.Application = express();
dotenv.config();
const port = process.env.PORT || 5000;

app.get('/', ( req:express.Request, res:express.Response) => res.send("helllllo"));

app.listen(port, () => {
    console.log( `server started at ${port}` );
});

app.use('/', router);