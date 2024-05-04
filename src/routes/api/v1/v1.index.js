import { Router } from "express";
import userRouter from "./user.route.js";
import videoRouter from "./video.route.js";

const v1Router = Router();

v1Router.use('/users' , userRouter);
v1Router.use('/videos' , videoRouter);


export default v1Router;