/*
  Warnings:

  - You are about to drop the column `bookId` on the `BookSession` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `BookSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BookSession` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `BookSession` table. All the data in the column will be lost.
  - You are about to drop the column `chapterId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `BookSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `BookSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookSession" DROP CONSTRAINT "BookSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- AlterTable
ALTER TABLE "BookSession" DROP COLUMN "bookId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "book_session_date" TIMESTAMP(3),
ADD COLUMN     "book_session_email" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "book_session_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "book_session_number" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_method" TEXT NOT NULL DEFAULT 'Paystack',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "transaction_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "chapterId",
DROP COLUMN "courseId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "details_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "details_skills" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "details_subtitle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "details_title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quiz_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quiz_title" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "courseId",
DROP COLUMN "createdAt",
DROP COLUMN "duration",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "certificate" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "duration_hours" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "featured_img_file_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured_img_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured_img_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured_video_file_id" TEXT,
ADD COLUMN     "featured_video_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured_video_url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instructor_description" TEXT,
ADD COLUMN     "instructor_name" TEXT,
ADD COLUMN     "instructor_title" TEXT,
ADD COLUMN     "mini_description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_average" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "ratings_five" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_four" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_one" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_three" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_total" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ratings_two" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "resources_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "selected_course_ids" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Archived',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserBookSession" (
    "id" SERIAL NOT NULL,
    "bookId" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBookSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "size" INTEGER NOT NULL DEFAULT 4,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coming" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "product" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'User',
    "status" TEXT NOT NULL DEFAULT 'Pending Approval',
    "bank_account_name" TEXT,
    "bank_account_number" TEXT,
    "bank_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL DEFAULT '',
    "options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answer" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "star" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" SERIAL NOT NULL,
    "user" INTEGER,
    "price" TEXT NOT NULL,
    "stop_loss" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "order_type" TEXT NOT NULL DEFAULT 'BUY',
    "profit_1" TEXT,
    "profit_2" TEXT,
    "profit_3" TEXT,
    "info" TEXT,
    "duration" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_draft" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" SERIAL NOT NULL,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "deleted_user_count" INTEGER NOT NULL DEFAULT 0,
    "user_enrolled_today" INTEGER NOT NULL DEFAULT 0,
    "user_stats_total_users" INTEGER NOT NULL DEFAULT 0,
    "user_stats_active_users" INTEGER NOT NULL DEFAULT 0,
    "user_stats_inactive_users" INTEGER NOT NULL DEFAULT 0,
    "user_stats_course_completed" INTEGER NOT NULL DEFAULT 0,
    "user_stats_enroll_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_stats_churn_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_stats_total" INTEGER NOT NULL DEFAULT 0,
    "review_stats_one" INTEGER NOT NULL DEFAULT 0,
    "review_stats_two" INTEGER NOT NULL DEFAULT 0,
    "review_stats_three" INTEGER NOT NULL DEFAULT 0,
    "review_stats_four" INTEGER NOT NULL DEFAULT 0,
    "review_stats_five" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tickets" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "product" TEXT NOT NULL,
    "transaction_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "reference" TEXT,
    "course_id" INTEGER,
    "affiliate_status" TEXT NOT NULL DEFAULT 'Pending Approval',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "book_session_name" TEXT,
    "book_session_number" TEXT,
    "book_session_email" TEXT,
    "book_session_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" SERIAL NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "size" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "unique_name" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "duration" TEXT,
    "file_id" TEXT,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "video" SERIAL NOT NULL,
    "user" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "duration" TEXT,
    "views" INTEGER NOT NULL DEFAULT 50,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("video")
);

-- AddForeignKey
ALTER TABLE "UserBookSession" ADD CONSTRAINT "UserBookSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSession" ADD CONSTRAINT "BookSession_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
