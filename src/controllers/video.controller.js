import { User } from "../models/user.model.js";
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

    const videoLocalPath = req.files.videoFile[0]?.path;
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

// get all videos
export const getAllVideos = asyncHandler(async(req , res) => {
      const {page = 1 , limit = 10 , query , sortBy , sortType , userId} = req.query;

      page = parseInt(page);
      limit = parseInt(limit);

      if(userId) {
          const userPostedVideos = await Video.aggregate([
            {
                $match : {
                    owner : userId
                }
            }
          ])

          return res.status(201).json(
            new ApiResponse(201 , userPostedVideos , "User Posted Videos fetched successfully")
          )
      }

    

      if(!query){
         const videos = await Video.aggregate([
            {
                $limit : limit
            },
            {
                $sort : {
                    sortBy : sortType
                }
            }
         ])

         return res.status(201).json(
            new ApiResponse(201 , videos , "Videos fetched successful")
         )
      }



      
      

})

// get video by id
export const getSingleVideo = asyncHandler(async(req , res) => {
    const {videoId} = req.params;

    const videoFile = await Video.findById(videoId);

    if(!videoFile){
        throw new ApiError(400 , "Error while fetching video");
    }

    return res.status(201).json(
        new ApiResponse(201 , videoFile , "Video fetched Successfully")
    )
})