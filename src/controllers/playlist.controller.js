import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";


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
    console.log(userId)

    if(!userId){
        throw new ApiError(400 , "No userId is present");
    }

    const existingUser = await User.findById(userId);

    if(!existingUser) {
        throw new ApiError(400 , "No user found");
    }

    const allPlaylists = await Playlist.find({
        owner : {
            $eq : userId
        }
    })

    return res.status(201).json(
        new ApiResponse(201 , allPlaylists , "All Playlist of a user")
    )

    
})

// get playlist by id
export const getPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId} = req.params;

    if(!PlaylistId) {
        throw new ApiError(400 , "Playlist Id is missing");
    }

    const existingPlaylist = await Playlist.findById(PlaylistId);

    if(!existingPlaylist) {
        throw new ApiError(500 , "Playlist not found");
    }

    return res.status(201).json(
        new ApiResponse(201 , existingPlaylist , "Playlist found")
    )

})


// add videos to playlist
export const addVideoToPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId , videoId} = req.params;

    if(!PlaylistId) {
        throw new ApiError(400 , "Select a valid playlist");
    }

    if(!videoId) {
        throw new ApiError(400 , "Select a valid video to add");
    }

    const ifPlaylistExist = await Playlist.findById(PlaylistId);
    const ifVideoExist = await Video.findById(videoId);

    if(!ifPlaylistExist || !ifVideoExist){
        throw new ApiError(400 , "playlist doesn't exist or video doesn't exist");
    }

    const existingPlaylist = await Playlist.findByIdAndUpdate(PlaylistId , {
        $push : {
            videos : videoId
        }
    })

    if(!existingPlaylist){
        throw new ApiError(400 , "Error while adding video to playlist");
    }

    return res.status(201).json(
        new ApiResponse(201, existingPlaylist , "Playlist Updated")
    )
})

// remove video from playlist
export const removeVideoFromPlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId , videoId} = req.params;
})


// delete playlist
export const deletePlaylist = asyncHandler(async(req , res) => {
    const {PlaylistId} = req.params;

    if(!PlaylistId){
        throw new ApiError(400 , "Playlist Id is missing");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(PlaylistId);

    if(!deletedPlaylist) {
        throw new ApiError(500 , "Error while deleting the playlist");
    }

    return res.status(201).json(
        new ApiResponse(201, {} , "Playlist deleted")
    )
})
