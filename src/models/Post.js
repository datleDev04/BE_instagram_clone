import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";


const postSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    caption: {
        type: String,
    },
    mediaUrls: [{ type: String }],

    location: {
        type: String
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    share: [{
        type: Schema.Types.ObjectId,
        ref: "Share"
    }],

    isArchive: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, postSchema)