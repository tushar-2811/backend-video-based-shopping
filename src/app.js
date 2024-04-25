import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({
    limit : "16kb"
}));

app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());



// Routes import

import indexRouter from './routes/route.index.js';

app.use('/' , indexRouter);




export default app;