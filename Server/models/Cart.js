import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const cartSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.plugin(AutoCount(mongoose), {
  inc_field: "cart",
  id: "cartNums",
  start_seq: 1,
});

export default mongoose.model("Cart", cartSchema);
