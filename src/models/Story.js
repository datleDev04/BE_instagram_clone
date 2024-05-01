import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Story";
const COLLECTION_NAME = "Storys";

const storySchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    mediaUrl: {
        type: String,
    },

    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],

    viewedBy: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],

    expiresAt: {
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000, // Thời gian hết hạn sau 24 giờ
    },
},{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, storySchema)