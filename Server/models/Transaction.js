import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    reference: {
      type: String,
    },
    courseId: {
      type: String,
    },
    affiliateStatus: {
      type: String,
      default: "Pending Approval",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Pending",
    },
    bookSession: {
      name: {
        type: String,
      },
      number: {
        type: String,
      },
      email: {
        type: String,
      },
      date: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// give numbers to each ticket starting from 500
transactionSchema.plugin(AutoCount(mongoose), {
  inc_field: "transaction",
  id: "transactionNums",
  start_seq: 1,
});

export default mongoose.model("Transaction", transactionSchema);
