import mongoose, { Schema } from "mongoose";

// schema User variables
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";



const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },

    gender: { 
        type: Schema.Types.ObjectId,
        ref: "Gender",
        required: true
    },

    address: {
      type: String,
    },

    post: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    storage: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    verify_code: {
      type: string
    },

    privateAccount: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, userSchema);
