import mongoose, { Schema } from "mongoose";

// schema User variables
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";



const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      unique: true,
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
    avatar_publicId: {
      type: String,
    },
    avatar_fileName: {
      type: String,
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },

    gender: {
      type: Number,
    },
    phone: {
      type: String,
      unique: true,
    },

    address: {
      type: String,
    },

    verify_code: {
      type: String
    },    

    resetPassword_Token: {
      type: String
    },    

    privateAccount: {
      type: Boolean,
      default: false
    },

  },
  {
    timestamps: true,
    versionKey: false,
    collection: COLLECTION_NAME,
  }
);

export default mongoose.model(DOCUMENT_NAME, userSchema);
