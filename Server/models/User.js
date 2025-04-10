import mongoose from "mongoose";

const getLastDayOfNextMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return new Date(year, month + 1, 0); // Last day of the next month
};

const quizScore = new mongoose.Schema({
  quizId: {
    type: String,
  },
  title: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
});

const chapter = new mongoose.Schema({
  chapterId: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
  },
  duration: {
    type: Number,
    default: 0,
  },
  commision: {
    type: Number,
    default: 0,
  },
  quiz: {
    type: [quizScore],
    default: [],
  },
  chapters: {
    type: [chapter],
    default: [],
  },
});

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
  },
  program: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      default: "User",
    },
    refreshToken: String,
    avatar: {
      name: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    activeCourseList: {
      type: [courseSchema],
      default: [],
    },
    bookSession: {
      type: [bookSchema],
      default: [],
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
      recipientCode: {
        type: String,
      },
    },
    affiliate: {
      commissionRate: {
        type: Number,
        default: 0,
      },
      balance: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
      conversion: {
        type: Number,
        default: 0,
      },
      lifetimeEarnings: {
        type: Number,
        default: 0,
      },
      withdrawalCount: {
        type: Number,
        default: 0,
      },
      dueDate: {
        type: Date,
        default: getLastDayOfNextMonth, // Sets the last day of the month by default
      },
      referee: {
        userId: {
          type: String,
        },
        date: {
          type: Date,
        },
      },
    },
    lastLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    reviews: {
      type: Number,
      default: 0,
    },
    students: {
      type: Number,
      default: 0,
    },
    courses: {
      type: Number,
      default: 0,
    },
    notifications: {
      reminders: {
        push: {
          type: Boolean,
          default: false,
        },
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: true,
        },
      },
      updates: {
        push: {
          type: Boolean,
          default: false,
        },
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: true,
        },
      },
      others: {
        push: {
          type: Boolean,
          default: false,
        },
        email: {
          type: Boolean,
          default: true,
        },
        sms: {
          type: Boolean,
          default: true,
        },
      },
    },
    isVerified: { type: Boolean, default: false }, // Updated field
    verificationCode: { type: Number }, // Set OTP as string for 6-digit code
    otpExpiry: { type: Date }, // Expiration time for OTP
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
