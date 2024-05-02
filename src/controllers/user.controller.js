import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';


const generateAccessAndRefreshTokens = async (userId) => {
     try {
        const existingUser = await User.findById(userId);

        const accessToken = existingUser.generateAccessToken();
        const refreshToken = existingUser.generateRefreshToken();

        existingUser.refreshToken = refreshToken;
        await existingUser.save({validatebeforeSave : true });

        return {
            accessToken , refreshToken
        }

     } catch (error) {
        console.log("error while generating access and refresh token" , error);
        throw new ApiError(500 , "something went wrong while generating access and refresh token");
     }
}


const options = {
    httpOnly : true,
    secure : true
};



// Register the new user
export const registerUser = asyncHandler( async(req , res) => {
    console.log("req.body->" , req.body);
    console.log("req.files-> " , req.files);
    const {
        userName, 
        email, 
        fullName,
        password 
    } = req.body;

    if(
        [userName , email , fullName , password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400 , "All fields are required");
    }

    const isUserExist = await User.findOne({
        $or: [{email} , {userName}]
    })

    if(isUserExist) {
        throw new ApiError(409 , "User with email or userName already Exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverImageLocalpath = req.files?.coverImage[0]?.path;
    let coverImageLocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalpath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is required!");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);

    if(!avatar) {
        console.log(avatar);
        throw new ApiError(400 , "Avatar is required");
    }

    const newUser = await User.create({
        userName : userName.toLowerCase() , 
        email , 
        fullName , 
        password , 
        avatar : avatar.url , 
        coverImage : coverImage?.url || "",
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
       throw new ApiError(500 , "Error while registering a new User");
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )
    
})




// Login of existing user
export const loginUser = asyncHandler( async(req , res) => {
     const {email , userName , password} = req.body;

     if(!userName && !email){
        throw new ApiError(400 , "userName or Email is required !");
     }

     const existingUser = await User.findOne({
        $or : [
            {userName} , {email}
        ]
     });

     if(!existingUser) {
        throw new ApiError(404 , "User does not exist!");
     }

    const isPasswordValid = await existingUser.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(404 , "Invalid User Credentials");
    }

   const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(existingUser._id);
    
   const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken"
   );
   
   return res.status(201)
         .cookie("accessToken" , accessToken , options)
         .cookie("refreshToken" , refreshToken , options)
         .json(
            new ApiResponse(200 , {
                user : loggedInUser, accessToken , refreshToken
            },
         "User Logged In Successfully" )
         )

});


// logout user
export const logoutUser = asyncHandler(async(req , res) => {
      const userId = req.user._id;

      await User.findByIdAndUpdate(userId , {
          $set : {
             refreshToken : ""
          }
      });

      return res.status(201)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken",options)
      .json(
        new ApiResponse(201 , "User Logged out successfully")
      )
})


// refresh the access token
export const refreshAccessToken = asyncHandler(async() => {
  try {
      const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken;
  
      if(!incomingRefreshToken){
          throw new ApiError(401 , "unauthorized request");
      }
  
     const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET);
  
     const existingUser = await User.findById(decodedToken?._id);
  
     if(!existingUser){
      throw new ApiError(401 , "Invalid Refresh Token");
     }
  
     if(incomingRefreshToken !== existingUser?.refreshToken){
         throw new ApiError(401 , "Refresh Token is Expired or Used");
     }
  
     const {accessToken , refreshToken} = await existingUser.generateAccessAndRefreshTokens(existingUser._id);
  
     return res.status(201)
     .cookie("accessToken" , accessToken , options)
     .cookie("refreshToken" , refreshToken , options)
     .json(
       new ApiResponse(201 ,
          {accessToken , refreshToken},
          "Access Token Refreshed"
      )
     )
     
  } catch (error) {
    console.log("error while refreshing access token", error);
    throw new ApiError(401 . error?.message || "Invalid Refresh Token");
  }
})



// Update Current Password
export const changeCurrentPassword = asyncHandler(async(req , res) => {
    const {oldPassword , newPassword} = req.body;

    const userId = req.user?._id;

    const existingUser = await User.findById(userId);

    const isOldPasswordCorrect = await existingUser.isPasswordCorrect(oldPassword);

    if(!isOldPasswordCorrect){
        throw new ApiError(400 , "Invalid Old Password");
    }

    existingUser.password = newPassword;
   await existingUser.save({validatebeforeSave : false});

   return res.status(201).json(
     new ApiResponse(201 , {} , "Password Changed Successfully.")
   )
})

// Get current Logged In User
export const getCurrentUser = asyncHandler(async(req , res) => {

    return res.status(201).json(
        new ApiResponse(201 , req.user , "current user fetched successfully")
    )
})


// Update Avatar
export const updateAvatar = asyncHandler(async(req , res) => {
    const avatarLocalPath = req.file?.path;
    const userId = req.user?._id;

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400 , "Error while uploading Avatar");
    }

    const updatedUser = await User.findByIdAndUpdate(userId , {
       $set : {
        avatar : avatar.url
       }
    }, {
        new : true
    }).select("-password ");

    return res.status(201).json(
        new ApiResponse(201 , updatedUser , "Avatar Updated")
    )

})


// user channel profile
export const getUserChannelProfile = asyncHandler(async(req , res) => {
    const {userName} = req.params();

    if(!userName?.trim()){
        throw new ApiError(400 , "userName is missing");
    }

    // aggregation pipeline
   const channel =  await User.aggregate([
        {
            $match : {
                userName : userName?.toLowerCase()
            }          
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscribers"
            }
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "subscriber",
                as : "subscribedTo"
            }
        },
        {
            $addFields : {
                subscribersCount : {
                    $size : "$subscribers"
                },
                subscribedToCount : {
                    $size : "$subscribedTo"
                },
                isSubscribed : {
                    $con : {
                        if: {$in: [req.user?._id , "$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project : {
                fullName : 1,
                userName : 1,
                subscribersCount : 1,
                subscribedToCount : 1,
                isSubscribed : 1,
                avatar : 1,
                coverImage : 1,
                email : 1
            }
        }
    ])

    if(!channel?.length) {
        throw new ApiError(400 , "Channel does Not exist");
    }

    return res.status(201).json(
        new ApiResponse(201 , channel[0] , "User Channel fetched Successfully")
    )

})































    // get user details from frontend
    // validation
    // check if user already exists
    // check for images , check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token feed from response
    // check if user created or not
    // return response properly