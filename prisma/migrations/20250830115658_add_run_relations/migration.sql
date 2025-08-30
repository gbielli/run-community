/*
  Warnings:

  - You are about to drop the column `organizer` on the `Run` table. All the data in the column will be lost.
  - Added the required column `organizerId` to the `Run` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Run` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Run" DROP COLUMN "organizer",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organizerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "currentParticipants" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."run_participant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "run_participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "run_participant_userId_runId_key" ON "public"."run_participant"("userId", "runId");

-- AddForeignKey
ALTER TABLE "public"."Run" ADD CONSTRAINT "Run_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."run_participant" ADD CONSTRAINT "run_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."run_participant" ADD CONSTRAINT "run_participant_runId_fkey" FOREIGN KEY ("runId") REFERENCES "public"."Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
