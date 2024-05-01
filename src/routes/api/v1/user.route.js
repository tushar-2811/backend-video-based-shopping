import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar } from "../../../controllers/user.controller.js";
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
userRouter.route('/getCurrentUser').post(verifyJWT , getCurrentUser);
userRouter.route('/updatePassword').post(verifyJWT , changeCurrentPassword);

userRouter.route('/updateAvatar').post(upload.fields(), verifyJWT , updateAvatar);


export default userRouter;