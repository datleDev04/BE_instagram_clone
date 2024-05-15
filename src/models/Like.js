import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Like";
const COLLECTION_NAME = "Likes";


const likeSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    reel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        required: true
    },
    story_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reel",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, likeSchema)