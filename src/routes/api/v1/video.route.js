import { Router } from "express";
import { deleteVideo, uploadVideo } from "../../../controllers/video.controller.js";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { upload } from "../../../middlewares/multer.middleware.js";

const videoRouter = Router();

videoRouter.route('/uploadVideo').post(verifyJWT,upload.fields([
    {
        name : "uVideo",
        maxCount : 1
    },
    {
        name : "thumbnail",
        maxCount : 1
    }
]),uploadVideo);

videoRouter.route('/deleteVideo/:videoId').delete(verifyJWT , deleteVideo);


export default videoRouter;