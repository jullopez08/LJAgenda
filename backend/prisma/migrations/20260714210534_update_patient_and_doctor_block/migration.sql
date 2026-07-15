/*
  Warnings:

  - You are about to drop the column `date` on the `DoctorBlock` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identification]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `DoctorBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `DoctorBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identification` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('CC', 'CE', 'TI', 'PASSPORT', 'NIT');

-- AlterTable
ALTER TABLE "DoctorBlock" DROP COLUMN "date",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "notes",
ADD COLUMN     "identification" TEXT NOT NULL,
ADD COLUMN     "identificationType" "IdentificationType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identification_key" ON "Patient"("identification");
