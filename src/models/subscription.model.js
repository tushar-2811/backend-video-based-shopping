import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    channel : {
        type : mongoose.Schema.Types.ObjectId, // ont to whom subscriber is subscribing
        ref : "User"
    },
    subscriber: {
        type : mongoose.Schema.Types.ObjectId, // one who is subscribing
        ref : "User"
    }
} , {timestamps : true});

export const Subscription = mongoose.model("Subscription" , subscriptionSchema);