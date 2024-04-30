import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler(async(req , res , next) => {
   try {
      const accessToken = req.cookies?.accessToken || 
                          req.header("Authorization")?.replace("Bearer " , "");
 
     if(!accessToken){
         throw new ApiError(401,"Unauthorized Request"); 
     }
     
 
     const decodedInformation = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);
 
     const existingUser = await User.findById(decodedInformation?._id).select(
         "-password  -refreshToken"
     )
 
     if(!existingUser) {
        throw new ApiError(401 , "Invalid Access Token");
     }
 
     req.user = existingUser;
     next();
   } catch (error) {
     throw new ApiError(401 , error?.message || "invalid access token");
   }

 })