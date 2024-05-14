import { asyncHandler } from "../utils/asyncHandler";
import { Like } from "../models/like.model";

export const toggleVideoLike = asyncHandler(async(req , res) => {
    const {videoId} = req.params;
})

export const toggleCommentLike = asyncHandler(async(req , res) => {
    const {commentId} = req.params;
})

// get all liked videos
export const getAllLikedVideos = asyncHandler(async(req , res) => {
    
})