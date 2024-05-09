import { Router } from "express";
import userRouter from "./user.route.js";
import videoRouter from "./video.route.js";
import likeRouter from "./like.route.js";
import commentRouter from "./comment.route.js";
import playlistRouter from "./playlist.route.js";

const v1Router = Router();

v1Router.use('/users' , userRouter);
v1Router.use('/videos' , videoRouter);
v1Router.use('/like' , likeRouter);
v1Router.use('/comment' , commentRouter);
v1Router.use('/playlist' , playlistRouter);


export default v1Router;