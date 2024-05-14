import { asyncHandler } from "../utils/asyncHandler";
import { Playlist } from "../models/playlist.model";

// create a playlist
export const createPlaylist = asyncHandler(async(req , res) => {
    const {name , description } = req.body;
})

// get user playlist
export const getUserPlaylist = asyncHandler(async(req , res) => {
    const {userId} = req.params;
})

// get playlist by id
export const getPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId} = req.params;
})


// add videos to playlist
export const addVideoToPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId , videoId} = req.params;
})

// remove video from playlist
export const removeVideoFromPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId , videoId} = req.params;
})


// delete playlist
export const deletePlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId} = req.params;
})
