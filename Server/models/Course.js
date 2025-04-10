import mongoose from "mongoose";
import AutoCount from "mongoose-sequence";

const uploadedFilesSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  uniqueName: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  date: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
  },
  fileId: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    default: "",
  },
  options: {
    type: [String],
    default: [],
  },
  answer: {
    type: Number,
    default: 0,
  },
});

const chapterSchema = new mongoose.Schema({
  details: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    skills: {
      type: String,
      default: "",
    },
  },

  uploadedFiles: {
    type: [uploadedFilesSchema], // Array of resources
    default: [], // Default to an empty array
  },

  quiz: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    questions: {
      type: [questionSchema], // Array of resources
      default: [], // Default to an empty array
    },
  },
});

const courseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    selectedCourseIds: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
      required: true,
    },
    featuredImg: {
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
    featuredVideo: {
      name: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
      },
      url: {
        type: String,
        default: "",
      },
    },
    miniDescription: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    certificate: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Archived",
    },
    name: {
      type: String,
      default: "",
    },
    commission: {
      type: Number,
      default: 0,
    },
    instructor: {
      name: {
        type: String,
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
    },
    chapters: {
      type: [chapterSchema],
      default: [],
    },
    durationHours: {
      type: Number,
      default: 1,
    },

    ratings: {
      total: {
        type: Number,
        default: 0,
      },
      average: {
        type: Number,
        default: 1,
      },
      one: {
        type: Number,
        default: 0,
      },
      two: {
        type: Number,
        default: 0,
      },
      three: {
        type: Number,
        default: 0,
      },
      four: {
        type: Number,
        default: 0,
      },
      five: {
        type: Number,
        default: 0,
      },
    },
    resourcesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Plugin to auto-increment course numbers
courseSchema.plugin(AutoCount(mongoose), {
  inc_field: "course",
  id: "courseNums",
  start_seq: 1,
});

export default mongoose.model("Course", courseSchema);
