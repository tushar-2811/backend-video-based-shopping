import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import brcypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        lowerCase : true,
        trim : true,
        index : true  // to inmprove searching
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowerCase : true,
        trim : true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String, // cloudinary url
        required : true   
    },
    coverImage : {
        type : String, // cloudinary url
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [ true , "Password is required" ]
    },
    refreshToken : {
        type : String,
    }

} , {timestamps : true});

userSchema.pre("save" ,async function (next) {
    if(!this.isModified("password")){
       return next();
    }
   this.password = brcypt.hash(this.password , 10);
   next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await brcypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
    {
        _id : this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }  
 )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }  
     )
}
 
export const User = mongoose.model("User" , userSchema);