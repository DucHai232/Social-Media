import mongoose from "mongoose";
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: String,
    likes: [],
    image: String,
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Posts", PostSchema);
export default PostModel;
