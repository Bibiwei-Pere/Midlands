import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const ticketsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    subject: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

ticketsSchema.plugin(AutoCount(mongoose), {
  inc_field: "tickets",
  id: "ticketsNums",
  start_seq: 1,
});

export default mongoose.model("Tickets", ticketsSchema);
