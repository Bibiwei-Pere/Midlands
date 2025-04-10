import mongoose from "mongoose";

const bookSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    program: {
      type: String,
      required: true,
    },
    bookSession: {
      name: {
        type: String,
        default: "",
      },
      number: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      date: {
        type: Date,
      },
    },
    status: {
      type: String,
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      default: "Paystack",
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BookSession", bookSessionSchema);
