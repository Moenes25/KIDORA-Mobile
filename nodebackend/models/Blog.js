import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    },

    coverImage: {
      type: String,
      default: ""
    },

    like: {
      type: Number,
      default: 0
    },

    share: {
      type: Number,
      default: 0
    },

    comment: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
