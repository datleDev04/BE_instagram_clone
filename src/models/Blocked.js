import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

// schema User variables
const DOCUMENT_NAME = "Blocked";
const COLLECTION_NAME = "Blockeds";

const blockedSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bocked_list: {
    type:  [{ type: Schema.Types.ObjectId, ref: "User" }],
    default: []
  },
},
{
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
});

blockedSchema.plugin(mongoosePaginate)

export default mongoose.model(DOCUMENT_NAME, blockedSchema);