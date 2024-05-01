import mongoose from "mongoose";

// schema User variables
const DOCUMENT_NAME = "CloseFriend";
const COLLECTION_NAME = "CloseFriends";

const closeFriendSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  closeFriends: [
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

export default mongoose.model(DOCUMENT_NAME, closeFriendSchema);