import { Router } from "express";
import { addComment, updateComment } from "../../../controllers/comment.controller.js";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.route('/createComment/:videoId').post(verifyJWT,addComment);
commentRouter.route('/updateComment/:commentId').put(verifyJWT,updateComment);

export default commentRouter;