import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category: {
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
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    views: {
      type: Number,
      default: 50,
    },
    rating: {
      type: Number,
      default: 4,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.plugin(AutoCount(mongoose), {
  inc_field: "video",
  id: "videoNums",
  start_seq: 1,
});

export default mongoose.model("Video", videoSchema);
