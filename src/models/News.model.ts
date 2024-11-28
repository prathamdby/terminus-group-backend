import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    header: { type: String, required: true },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    articleUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("News", newsSchema);
