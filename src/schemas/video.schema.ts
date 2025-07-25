import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
  },
});

const Video = mongoose.models.Video || mongoose.model("Video", uploadSchema);

export default Video;
