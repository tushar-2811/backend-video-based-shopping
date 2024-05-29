import { asyncHandler } from "../utils/asyncHandler";
import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";

export const toggleVideoLike = asyncHandler(async(req , res) => {
    const {videoId} = req.params;
    const userId = req.user._id;

    if(!videoId){
        throw new ApiError(400 , "No videoId is found");
    }

    if(!userId){
        throw new ApiError(400 , "user is not signed-In");
    }

    // if video is already liked by this user
    // then, just dislike it
    

    

    // if video is not already liked by user
    // then just like it
})

export const toggleCommentLike = asyncHandler(async(req , res) => {
    const {commentId} = req.params;
})

// get all liked videos
export const getAllLikedVideos = asyncHandler(async(req , res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(400 , "User is not defined");
    }

    const likedVideos = await Like.aggregate([
        {
            $match : {
                likedBy : userId
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video"
            }
        }
    ])


})