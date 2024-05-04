import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// upload video for particular user(channel)
export const uploadVideo = asyncHandler(async(req , res) => {
    const userId = req.user?._id;
    const {title , description } = req.body;

    if(!title || !description){
        throw new ApiError(400 , "InComplete Information");
    }

    if(!userId) {
        throw new ApiError(400 , "User not defined Properly");
    }

    const videoLocalPath = req.files.uVideo[0]?.path;
    const thumbnailLocalPath = req.files.thumbnail[0]?.path;



    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400 , "video not found");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!video || !thumbnail) {
        throw new ApiError(400 , "Not uploaded on database");
    }

   
    const newVideo = await Video.create({
        videoFile : video.url,
        thumbnail : thumbnail.url,
        title,
        description,
        duration : video.duration,
        owner : userId
    })

    if(!newVideo){
        throw new ApiError(400 , "Error while uploading video on database")
    }

    return res.status(201).json(
        new ApiResponse(201 , newVideo , "Video uploaded successfully" )
    )
})


// delete video from database

export const deleteVideo = asyncHandler(async(req , res) => {
    const {videoId} = req.params;

    const existingVideo = await Video.findByIdAndDelete(videoId);

    return res.status(201).json(
        new ApiResponse(201 , {} , "Deleted Successfully")
    )
})