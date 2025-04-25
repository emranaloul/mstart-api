/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Jwt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Jwt_userId_key" ON "Jwt"("userId");
