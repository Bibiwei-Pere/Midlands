import { Schema, model } from "mongoose";

const signalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: String,
      required: true,
    },
    stopLoss: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      default: "BUY",
    },
    profit1: {
      type: String,
    },
    profit2: {
      type: String,
    },
    profit3: {
      type: String,
    },
    info: {
      type: String,
    },
    duration: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

export default model("Signal", signalSchema);
