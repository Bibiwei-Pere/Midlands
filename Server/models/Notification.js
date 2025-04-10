import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    // Each note belongs to a user with a special number ObjectId that matches that user
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    product: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

export default model("Notification", notificationSchema);
