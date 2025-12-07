/*
  Warnings:

  - You are about to drop the `UserGoals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGoals" DROP CONSTRAINT "UserGoals_userId_fkey";

-- DropTable
DROP TABLE "UserGoals";
