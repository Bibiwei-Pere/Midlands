import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    deletedUserCount: { type: Number, default: 0 },
    userEnrolledToday: { type: Number, default: 0 },

    userStats: {
      totalUsers: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      inactiveUsers: { type: Number, default: 0 },
      courseCompleted: { type: Number, default: 0 },
      userEnrollRate: { type: Number, default: 0 },
      userChunRate: { type: Number, default: 0 },
    },

    reviewStats: {
      total: { type: Number, default: 0 },
      one: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      five: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Statistics", statisticsSchema);
