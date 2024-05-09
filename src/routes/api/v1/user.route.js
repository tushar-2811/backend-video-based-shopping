import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar } from "../../../controllers/user.controller.js";
import {upload} from "../../../middlewares/multer.middleware.js"
import { verifyJWT } from "../../../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route('/register').post(upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },{
        name : "coverImage",
        maxCount : 1
    }
]),registerUser);

userRouter.route('/login').post(loginUser);

// secured Routes
userRouter.route('/logout').post(verifyJWT, logoutUser);
userRouter.route('/refreshToken').post(refreshAccessToken);
userRouter.route('/getCurrentUser').get(verifyJWT , getCurrentUser);
userRouter.route('/updatePassword').post(verifyJWT , changeCurrentPassword);

userRouter.route('/updateAvatar').patch(upload.single("avatar"), verifyJWT , updateAvatar);

userRouter.route('/getUserChannel/:userName').post(verifyJWT,getUserChannelProfile);
userRouter.route('/getUserHistory').get(verifyJWT,getWatchHistory);




export default userRouter;