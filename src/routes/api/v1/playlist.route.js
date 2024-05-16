import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylist, getUserPlaylist } from "../../../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.route('/createPlaylist').post(verifyJWT , createPlaylist);
playlistRouter.route('/UpdatePlaylist/:PlaylistId/:videoId').put(verifyJWT , addVideoToPlaylist);

// get playlist by id
playlistRouter.route('/getPlaylist/:PlaylistId').get(getPlaylist);
// delete playlist by id
playlistRouter.route('/deletePlaylist/:PlaylistId').delete(deletePlaylist);
// get user playlist
playlistRouter.route('/getUserPlaylist/:userId').get(getUserPlaylist);

export default playlistRouter;