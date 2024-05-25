import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from 'mongoose'


// add comment on a video
export const addComment = asyncHandler(async(req , res) => {
      const {videoId} = req.params;
      const userId = req.user._id;
      const {commentContent} = req.body;

      if(!videoId){
        throw new ApiError(400 , "No video found");
      }

      if(!userId) {
        throw new ApiError(400 , "Please Sign In");
      }

      if(!commentContent){
        throw new ApiError(400 , "Please Comment something to publish");
      }

      const newComment = await Comment.create({
         content : commentContent,
         video : videoId,
         owner : userId
      })

      if(!newComment){
        throw new ApiError(400 , "Error while commenting");
      }

      const newCommentData = await Comment.aggregate([
        {
          $match : {
            _id : new mongoose.Types.ObjectId(newComment._id)
          }
        },
        {
          $lookup : {
            from : "users",
            localField : "owner",
            foreignField : "_id",
            as : "owner",
            pipeline : [
              {
                $project : {
                  userName : 1,
                  fullName : 1,
                  avatar : 1
                }
              }
            ]
          }
        },
        {
          $addFields : {
             owner : {
              $first : "$owner"
             }
          }
        }
      ])

      

      return res.status(201).json(
        new ApiResponse(201 , newCommentData , "New Comment published")
      )

})

// update a comment
export const updateComment = asyncHandler(async(req , res) => {
      const {commentId} = req.params;
      const {commentContent} = req.body;

      if(!commentId){
        throw new ApiError(400 , "No comment found");
      }

      if(!commentContent){
        throw new ApiError(400 , "Please Comment something to publish");
      }

      const updatedComment = await Comment.findByIdAndUpdate(commentId , {
         $set : {
          content : commentContent
         }
      } , {
        new : true
      })

      if(!updateComment){
        throw new ApiError(400 , "Error while updating the comment");
      }

      return res.status(201).json(
        new ApiResponse(201 , updatedComment , "Comment updated Successfully")
      )

})

// delete a comment
export const deleteComment = asyncHandler(async(req , res) => {

})

// get all comments on a video
export const getAllComments = asyncHandler(async(req , res) => {
    const {videoId} = req.params;
    const {page = 1 , limit = 10} = req.query;



})