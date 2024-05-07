import mongoose from "mongoose";

const playlistModel = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },

    videos :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    }],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

} , {timestamps : true});

export const Playlist = mongoose.model("Playlist" , playlistModel);