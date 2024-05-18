import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
// schema User variables
const DOCUMENT_NAME = "CloseFriend";
const COLLECTION_NAME = "CloseFriends";

const closeFriendSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  closeFriends: {
    type:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  }, 
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
});

closeFriendSchema.plugin(mongoosePaginate)

export default mongoose.model(DOCUMENT_NAME, closeFriendSchema);