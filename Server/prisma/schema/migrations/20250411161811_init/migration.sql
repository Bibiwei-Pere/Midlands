-- CreateTable
CREATE TABLE "BookSession" (
    "id" SERIAL NOT NULL,
    "bookId" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "chapterId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "courseId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizScore" (
    "id" SERIAL NOT NULL,
    "quizId" TEXT NOT NULL,
    "title" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "courseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "about" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "role" TEXT NOT NULL DEFAULT 'User',
    "refreshToken" TEXT,
    "avatarName" TEXT NOT NULL DEFAULT '',
    "avatarFileId" TEXT NOT NULL DEFAULT '',
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "bankAccountName" TEXT,
    "bankAccountNumber" TEXT,
    "bankName" TEXT,
    "bankRecipientCode" TEXT,
    "affiliateCommissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affiliateBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affiliateCount" INTEGER NOT NULL DEFAULT 0,
    "affiliateConversion" INTEGER NOT NULL DEFAULT 0,
    "affiliateLifetimeEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affiliateWithdrawalCount" INTEGER NOT NULL DEFAULT 0,
    "affiliateDueDate" TIMESTAMP(3) NOT NULL DEFAULT '2025-05-31 23:59:59.999 +00:00',
    "affiliateRefereeUserId" TEXT,
    "affiliateRefereeDate" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "reviews" INTEGER NOT NULL DEFAULT 0,
    "students" INTEGER NOT NULL DEFAULT 0,
    "courses" INTEGER NOT NULL DEFAULT 0,
    "notificationsRemindersPush" BOOLEAN NOT NULL DEFAULT false,
    "notificationsRemindersEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationsRemindersSms" BOOLEAN NOT NULL DEFAULT true,
    "notificationsUpdatesPush" BOOLEAN NOT NULL DEFAULT false,
    "notificationsUpdatesEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationsUpdatesSms" BOOLEAN NOT NULL DEFAULT true,
    "notificationsOthersPush" BOOLEAN NOT NULL DEFAULT false,
    "notificationsOthersEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationsOthersSms" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" INTEGER,
    "otpExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "BookSession" ADD CONSTRAINT "BookSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizScore" ADD CONSTRAINT "QuizScore_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
