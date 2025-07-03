/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[inviteCode]` on the table `Calendar` will be added. If there are existing duplicate values, this will fail.
  - The required column `inviteCode` was added to the `Calendar` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_userId_fkey";

-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "updatedAt",
ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_userId_calendarId_key" ON "Participant"("userId", "calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_inviteCode_key" ON "Calendar"("inviteCode");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
