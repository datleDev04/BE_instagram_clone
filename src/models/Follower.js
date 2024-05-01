import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Follower";
const COLLECTION_NAME = "Followers";

const followerSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
});

export default mongoose.model(DOCUMENT_NAME, followerSchema);