import { date, z } from "zod";

// AUTH
export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }).default(""),
  password: z.string().min(1, { message: "Password is required" }).default(""),
});

export const formSchemaReview = z.object({
  response: z.string().min(1, "Review comment is required"),
  star: z.number().min(0).max(5, "Rating must be between 0 and 5"),
});

export const signupSchema = z.object({
  username: z.string().min(4, { message: "Username is required" }).default(""),
  phone: z.string().min(11, { message: "Phone number must be 11 digit" }).default(""),
  email: z.string().email({ message: "Email is required" }).default(""),
  password: z.string().min(6, { message: "Password is required" }).default(""),
  confirmPassword: z.string().min(6, { message: "Confirm Password is required" }).default(""),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email is required" }).default(""),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password is required" }).default(""),
  confirmPassword: z.string().min(6, { message: "Confirm Password is required" }).default(""),
});

export const socialLoginSchema = z.object({
  phone: z.string().min(11, { message: "Phone number must be 11 digit" }).default(""),
  password: z.string().min(6, { message: "Password is required" }).default(""),
});

export const formSchemaContact = z.object({
  first_name: z.string().default(""),
  last_name: z.string().default(""),
  company_name: z.string().default(""),
  email: z.string().email("Invalid email address").default(""),
  phone: z.string().default(""),
});

//DASHBOARD

export const uploadVideoSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }).default(""),
  category: z.string().min(2, { message: "Category is required" }).default(""),
  description: z.string().min(5, { message: "Description is required" }).default(""),
  rating: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name required" }).default(""),
});

export const checkoutSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }).default(""),
  lastName: z.string().min(2, { message: "Last name is required" }).default(""),
  country: z.string().min(2, { message: "Country is required" }).default(""),
  email: z.string().min(2, { message: "Email is required" }).default(""),
  // payment: z.string().min(2, { message: "Payment method is required" }).default(""),
});

export const payoutSchema = z.object({
  status: z.string().min(2, { message: "Status is required" }).default(""),
});

export const chapterSchema = z.object({
  details: z
    .object({
      title: z.string().min(2, "Chapter title is required"),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      skills: z.string().optional(),
    })
    .optional(),
  quiz: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      questions: z
        .array(
          z.object({
            question: z.string(),
            options: z.array(z.string()),
            answer: z.number().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export const profileSchema = z.object({
  firstname: z.string().min(2, { message: "Firstname is required" }).default(""),
  lastname: z.string().min(2, { message: "Lastname is required" }).default(""),
  email: z.string().optional(),
  passwordReset: z
    .object({
      currentPassword: z.string().optional(),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .optional(),
});

export const notificationsSchema = z.object({
  updates: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
  reminders: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
  others: z
    .object({
      push: z.boolean().optional(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
});

export const formSchemaPayment = z.object({
  bankName: z.string().min(2, { message: "Bank Name is required" }).default(""),
  accountName: z.string().default("").optional(),
  accountNumber: z.string().min(2, { message: "Account Number is required" }).default(""),
});

export const requestPayoutSchema = z.object({
  amount: z.string().min(2, "Amount field is required."),
  beneficiary: z.string().optional(),
});

export const contactSchema = z.object({
  fullName: z.string().min(4, "Full Name field is required."),
  email: z.string().min(4, "Email field is required."),
  title: z.string().min(4, "Title field is required."),
  description: z.string().min(4, "Description field is required."),
});

export const formSchemaSupport = z.object({
  category: z.string().min(1, "Category field is required.").default(""),
  subject: z.string().min(1, "Subject field is required.").default(""),
  description: z.string().min(4, "Description field is required.").default(""),
  email: z.string().min(4, "Email field is required.").default(""),
  status: z.string().default("Open").optional(),
});

export const formSchemaBookSession = z.object({
  payment: z.string().min(1, "Payment field is required.").default(""),
  name: z.string().min(1, "Name field is required.").default(""),
  program: z.string().min(1, "Program field is required.").default(""),
  email: z.string().min(4, "Email field is required.").default(""),
  number: z.string().min(4, "Number field is required.").default(""),
  date: z.date({
    required_error: "Date/time is required.",
  }),
});

export const createCourseSchema = z.object({
  title: z.string().optional(),
  miniDescription: z.string().optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  commission: z.string().optional(),
  durationHours: z.string().optional(),
});

export const signalSchema = z.object({
  currency: z.string().min(2, { message: "Currency is required" }),
  price: z.string().min(2, { message: "Price is required" }),
  stopLoss: z.string().min(2, { message: "Stop Loss is required" }),
  profit1: z.string().optional(),
  profit2: z.string().optional(),
  profit3: z.string().optional(),
  duration: z.string().optional(),
  info: z.string().optional(),
});

export const userSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  commissionRate: z.string().optional(),
  balance: z.string().optional(),
});

export const searchSchema = z.object({
  category: z.string().optional(),
  duration: z.number().optional(),
  ratings: z.number().optional(),
  price: z.number().optional(),
});

export const formSignUpVerification = z.object({
  verificationCode: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
