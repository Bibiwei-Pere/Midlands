/*
  Warnings:

  - The `affiliateRefereeUserId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bookSession_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "affiliateRefereeUserId",
ADD COLUMN     "affiliateRefereeUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookSession_id_fkey" FOREIGN KEY ("bookSession_id") REFERENCES "BookSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
