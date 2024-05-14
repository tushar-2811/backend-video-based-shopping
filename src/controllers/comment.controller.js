import { asyncHandler } from "../utils/asyncHandler";
import { Comment } from "../models/comment.model";


// add comment on a video
export const addComment = asyncHandler(async(req , res) => {

})

// update a comment
export const updateComment = asyncHandler(async(req , res) => {

})

// delete a comment
export const deleteComment = asyncHandler(async(req , res) => {

})

// get all comments on a video
export const getAllComments = asyncHandler(async(req , res) => {
    const {videoId} = req.params;
    const {page = 1 , limit = 10} = req.query;



})