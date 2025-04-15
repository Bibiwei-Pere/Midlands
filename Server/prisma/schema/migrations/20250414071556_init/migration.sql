/*
  Warnings:

  - Changed the type of `course_id` on the `Certificate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "course_id",
ADD COLUMN     "course_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserChapter" (
    "userId" INTEGER NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserChapter_pkey" PRIMARY KEY ("userId","chapterId")
);

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChapter" ADD CONSTRAINT "UserChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
