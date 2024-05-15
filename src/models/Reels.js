import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Reel";
const COLLECTION_NAME = "Reels";


const reelSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    caption: {
        type: String,
    },

    location: {
        type: String,
    },

    mediaUrl: {
        type: String
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
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

export default mongoose.model(DOCUMENT_NAME, reelSchema)