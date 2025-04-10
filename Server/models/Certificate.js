import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const certificateSchema = new mongoose.Schema(
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
    courseId: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 4,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.plugin(AutoCount(mongoose), {
  inc_field: "certificate",
  id: "certificateNums",
  start_seq: 1,
});

export default mongoose.model("Certificate", certificateSchema);
