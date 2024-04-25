import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler( async(req , res) => {
    return res.status(200).json({
        message : "ok"
     });
})


export const loginUser = asyncHandler( async(req , res) => {
   return res.status(201).json({
        message : "ok"
    });
})