import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Share";
const COLLECTION_NAME = "Shares";


const shareSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME
})

export default mongoose.model(DOCUMENT_NAME, shareSchema)