import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create a playlist
export const createPlaylist = asyncHandler(async(req , res) => {
    const {name , description } = req.body;

    const userId = req.user?._id;

    if(!name || !description) {
        throw new ApiError(400 , "Sufficient Information is not provided");
    }

    const existingPlaylist = await Playlist.findOne({name});

    if(existingPlaylist) {
        throw new ApiError(400 , "Playlist with this name already exist");
    }

    const newPlaylist = await Playlist.create({
        name,
        description, 
        owner : userId
    });

    if(!newPlaylist){
        throw new ApiError(500 , "Error while creating a playlist");
    }

    return res.status(201).json(
        new ApiResponse(201 , newPlaylist , "New Playlist Created")
    )

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
