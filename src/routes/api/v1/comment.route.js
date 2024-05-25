import { Router } from "express";
import { addComment } from "../../../controllers/comment.controller.js";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";

const commentRouter = Router();

commentRouter.route('/createComment/:videoId').post(verifyJWT,addComment);

export default commentRouter;