import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


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
   return res.status(201).json({
        message : "ok"
    });
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