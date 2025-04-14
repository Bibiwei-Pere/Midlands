
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserBookSessionScalarFieldEnum = {
  id: 'id',
  bookId: 'bookId',
  program: 'program',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  program: 'program',
  bookSessionName: 'bookSessionName',
  bookSessionNumber: 'bookSessionNumber',
  bookSessionEmail: 'bookSessionEmail',
  bookSessionDate: 'bookSessionDate',
  status: 'status',
  paymentMethod: 'paymentMethod',
  transactionId: 'transactionId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  category: 'category',
  title: 'title',
  amount: 'amount',
  count: 'count',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CertificateScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  category: 'category',
  title: 'title',
  courseId: 'courseId',
  size: 'size',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChapterScalarFieldEnum = {
  id: 'id',
  courseId: 'courseId',
  title: 'title',
  subtitle: 'subtitle',
  completed: 'completed',
  description: 'description',
  skills: 'skills',
  quizTitle: 'quizTitle',
  quizDescription: 'quizDescription'
};

exports.Prisma.ComingScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  name: 'name',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CourseScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  selectedCourseIds: 'selectedCourseIds',
  title: 'title',
  featuredImgName: 'featuredImgName',
  featuredImgFileId: 'featuredImgFileId',
  featuredImgUrl: 'featuredImgUrl',
  featuredVideoName: 'featuredVideoName',
  featuredVideoFileId: 'featuredVideoFileId',
  featuredVideoUrl: 'featuredVideoUrl',
  miniDescription: 'miniDescription',
  description: 'description',
  certificate: 'certificate',
  price: 'price',
  category: 'category',
  status: 'status',
  name: 'name',
  commission: 'commission',
  instructorName: 'instructorName',
  instructorTitle: 'instructorTitle',
  instructorDescription: 'instructorDescription',
  durationHours: 'durationHours',
  ratingsTotal: 'ratingsTotal',
  ratingsAverage: 'ratingsAverage',
  ratingsOne: 'ratingsOne',
  ratingsTwo: 'ratingsTwo',
  ratingsThree: 'ratingsThree',
  ratingsFour: 'ratingsFour',
  ratingsFive: 'ratingsFive',
  resourcesCount: 'resourcesCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  text: 'text',
  product: 'product',
  isRead: 'isRead',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayoutScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  username: 'username',
  email: 'email',
  amount: 'amount',
  role: 'role',
  status: 'status',
  bankAccountName: 'bankAccountName',
  bankAccountNumber: 'bankAccountNumber',
  bankName: 'bankName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  chapterId: 'chapterId',
  question: 'question',
  options: 'options',
  answer: 'answer'
};

exports.Prisma.QuizScoreScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  title: 'title',
  score: 'score',
  courseId: 'courseId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  courseId: 'courseId',
  instructorId: 'instructorId',
  response: 'response',
  star: 'star',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SignalScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  price: 'price',
  stopLoss: 'stopLoss',
  currency: 'currency',
  orderType: 'orderType',
  profit1: 'profit1',
  profit2: 'profit2',
  profit3: 'profit3',
  info: 'info',
  duration: 'duration',
  isRead: 'isRead',
  isDraft: 'isDraft',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StatisticsScalarFieldEnum = {
  id: 'id',
  lastLogin: 'lastLogin',
  isActive: 'isActive',
  deletedUserCount: 'deletedUserCount',
  userEnrolledToday: 'userEnrolledToday',
  userStatsTotalUsers: 'userStatsTotalUsers',
  userStatsActiveUsers: 'userStatsActiveUsers',
  userStatsInactiveUsers: 'userStatsInactiveUsers',
  userStatsCourseCompleted: 'userStatsCourseCompleted',
  userStatsEnrollRate: 'userStatsEnrollRate',
  userStatsChurnRate: 'userStatsChurnRate',
  reviewStatsTotal: 'reviewStatsTotal',
  reviewStatsOne: 'reviewStatsOne',
  reviewStatsTwo: 'reviewStatsTwo',
  reviewStatsThree: 'reviewStatsThree',
  reviewStatsFour: 'reviewStatsFour',
  reviewStatsFive: 'reviewStatsFive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TicketsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subject: 'subject',
  email: 'email',
  description: 'description',
  category: 'category',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  product: 'product',
  transactionType: 'transactionType',
  amount: 'amount',
  duration: 'duration',
  reference: 'reference',
  courseId: 'courseId',
  affiliateStatus: 'affiliateStatus',
  completed: 'completed',
  active: 'active',
  status: 'status',
  bookSessionName: 'bookSessionName',
  bookSessionNumber: 'bookSessionNumber',
  bookSessionEmail: 'bookSessionEmail',
  bookSessionDate: 'bookSessionDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UploadedFileScalarFieldEnum = {
  id: 'id',
  chapterId: 'chapterId',
  name: 'name',
  size: 'size',
  type: 'type',
  uniqueName: 'uniqueName',
  url: 'url',
  date: 'date',
  title: 'title',
  description: 'description',
  duration: 'duration',
  fileId: 'fileId'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  firstname: 'firstname',
  lastname: 'lastname',
  phone: 'phone',
  password: 'password',
  email: 'email',
  about: 'about',
  skills: 'skills',
  role: 'role',
  refreshToken: 'refreshToken',
  avatarName: 'avatarName',
  avatarFileId: 'avatarFileId',
  avatarUrl: 'avatarUrl',
  bankAccountName: 'bankAccountName',
  bankAccountNumber: 'bankAccountNumber',
  bankName: 'bankName',
  bankRecipientCode: 'bankRecipientCode',
  affiliateCommissionRate: 'affiliateCommissionRate',
  affiliateBalance: 'affiliateBalance',
  affiliateCount: 'affiliateCount',
  affiliateConversion: 'affiliateConversion',
  affiliateLifetimeEarnings: 'affiliateLifetimeEarnings',
  affiliateWithdrawalCount: 'affiliateWithdrawalCount',
  affiliateDueDate: 'affiliateDueDate',
  affiliateRefereeUserId: 'affiliateRefereeUserId',
  affiliateRefereeDate: 'affiliateRefereeDate',
  lastLogin: 'lastLogin',
  isActive: 'isActive',
  isDeleted: 'isDeleted',
  reviews: 'reviews',
  students: 'students',
  courses: 'courses',
  notificationsRemindersPush: 'notificationsRemindersPush',
  notificationsRemindersEmail: 'notificationsRemindersEmail',
  notificationsRemindersSms: 'notificationsRemindersSms',
  notificationsUpdatesPush: 'notificationsUpdatesPush',
  notificationsUpdatesEmail: 'notificationsUpdatesEmail',
  notificationsUpdatesSms: 'notificationsUpdatesSms',
  notificationsOthersPush: 'notificationsOthersPush',
  notificationsOthersEmail: 'notificationsOthersEmail',
  notificationsOthersSms: 'notificationsOthersSms',
  isVerified: 'isVerified',
  verificationCode: 'verificationCode',
  otpExpiry: 'otpExpiry',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VideoScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  category: 'category',
  title: 'title',
  description: 'description',
  videoUrl: 'videoUrl',
  duration: 'duration',
  views: 'views',
  rating: 'rating',
  isPublic: 'isPublic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  UserBookSession: 'UserBookSession',
  BookSession: 'BookSession',
  Cart: 'Cart',
  Category: 'Category',
  Certificate: 'Certificate',
  Chapter: 'Chapter',
  Coming: 'Coming',
  Course: 'Course',
  Notification: 'Notification',
  Payout: 'Payout',
  Question: 'Question',
  QuizScore: 'QuizScore',
  Review: 'Review',
  Signal: 'Signal',
  Statistics: 'Statistics',
  Tickets: 'Tickets',
  Transaction: 'Transaction',
  UploadedFile: 'UploadedFile',
  User: 'User',
  Video: 'Video'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
