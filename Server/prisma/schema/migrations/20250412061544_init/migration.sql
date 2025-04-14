-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
