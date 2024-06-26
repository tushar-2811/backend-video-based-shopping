import { Router } from "express";
import { deleteVideo, getAllVideos, getSingleVideo, togglePublishStatus, uploadVideo } from "../../../controllers/video.controller.js";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { upload } from "../../../middlewares/multer.middleware.js";

const videoRouter = Router();

videoRouter.route('/uploadVideo').post(verifyJWT,upload.fields([
    {
        name : "videoFile",
        maxCount : 1
    },
    {
        name : "thumbnail",
        maxCount : 1
    }
]),uploadVideo);

videoRouter.route('/getAllVideos').get(getAllVideos);
videoRouter.route('/getSingleVideo/:videoId').get(getSingleVideo);

videoRouter.route('/deleteVideo/:videoId').delete(verifyJWT , deleteVideo);
videoRouter.route('/togglePublish/:videoId').put(verifyJWT , togglePublishStatus);




export default videoRouter;