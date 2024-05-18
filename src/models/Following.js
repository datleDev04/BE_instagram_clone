import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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

FollowingSchema.plugin(mongoosePaginate)

export default mongoose.model(DOCUMENT_NAME, FollowingSchema);