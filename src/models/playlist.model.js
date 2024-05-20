import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

playlistModel.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model("Playlist" , playlistModel);