import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middleware.js";
import { createPlaylist, deletePlaylist, getPlaylist } from "../../../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.route('/createPlaylist').post(verifyJWT , createPlaylist);
playlistRouter.route('/getplaylist/:PlaylistId').get(getPlaylist);
playlistRouter.route('/deleteplaylist/:PlaylistId').delete(deletePlaylist);

export default playlistRouter;