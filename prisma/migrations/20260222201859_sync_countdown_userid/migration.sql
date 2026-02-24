/*
  Warnings:

  - Added the required column `updatedAt` to the `Countdown` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Countdown` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Countdown" DROP CONSTRAINT "Countdown_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Countdown" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Countdown" ADD CONSTRAINT "Countdown_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Countdown" ADD CONSTRAINT "Countdown_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
