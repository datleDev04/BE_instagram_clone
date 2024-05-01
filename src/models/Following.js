import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "Following";
const COLLECTION_NAME = "Followings";

const FollowingSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followings: [
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

export default mongoose.model(DOCUMENT_NAME, FollowingSchema);