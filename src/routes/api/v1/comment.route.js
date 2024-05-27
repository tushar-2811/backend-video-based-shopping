import { Router } from "express";
import { addComment, deleteComment, getAllComments, updateComment } from "../../../controllers/comment.controller.js";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.route('/createComment/:videoId').post(verifyJWT,addComment);
commentRouter.route('/updateComment/:commentId').put(verifyJWT,updateComment);
commentRouter.route('/deleteComment/:commentId').delete(verifyJWT , deleteComment);
commentRouter.route('/getComments/:videoId').get(getAllComments);

export default commentRouter;