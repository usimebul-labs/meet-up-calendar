/*
  Warnings:

  - Added the required column `endDate` to the `Calendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Calendar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Calendar" ADD COLUMN     "availableDays" INTEGER[],
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL;
