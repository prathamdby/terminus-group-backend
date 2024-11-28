import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    yearOfCompletion: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    architect: { type: String, required: true },
    landscapeArchitect: String,
    structuralEngineer: String,
    projectManagement: String,
    consultants: [String],
    brochureUrl: String,
    images: {
      type: [String],
      validate: [
        (array: string[]) => array.length <= 5,
        "Cannot upload more than 5 images",
      ],
    },
    secondarySummary: String,
    youtubeVideoUrl: String,
    tags: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
