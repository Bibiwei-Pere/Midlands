import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "User",
    },
    status: {
      type: String,
      default: "Pending Approval",
    },
    bankDetails: {
      accountName: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankName: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payout", payoutSchema);
