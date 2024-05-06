import mongoose from "mongoose";

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

export default mongoose.model(DOCUMENT_NAME, closeFriendSchema);