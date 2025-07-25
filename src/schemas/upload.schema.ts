import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;
