import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

// schema User variables
const DOCUMENT_NAME = "Follower";
const COLLECTION_NAME = "Followers";

const followerSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  followers: {
    type:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
  pendingFollowers: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
});

followerSchema.plugin(mongoosePaginate)

export default mongoose.model(DOCUMENT_NAME, followerSchema);