import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    author: String,
    category: String,
    image: String,
    slug: { type: String, unique: true },
    content: String,
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
