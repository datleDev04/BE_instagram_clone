import mongoose, { Schema } from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Token";
const COLLECTION_NAME = "Tokens";

const tokenSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refresh_token: {
        type: String,
        required: true
    },
    device_info: {
        type: String,
        required: true
    },
    ip_address: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
})

export default mongoose.model(DOCUMENT_NAME, tokenSchema)