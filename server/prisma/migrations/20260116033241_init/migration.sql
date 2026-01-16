-- CreateEnum
CREATE TYPE "MinistryCategory" AS ENUM ('CHURCH', 'MISSIONS', 'EDUCATION', 'HUMANITARIAN', 'YOUTH', 'MEDIA', 'HEALTHCARE', 'ADVOCACY', 'OTHER');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('PENDING', 'APPROVED', 'FUNDED', 'REJECTED');

-- CreateTable
CREATE TABLE "Ministry" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ein" VARCHAR(10),
    "category" "MinistryCategory" NOT NULL,
    "description" TEXT,
    "mission" TEXT,
    "website" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(50),
    "country" VARCHAR(50) NOT NULL DEFAULT 'USA',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GivingFund" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "donorId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GivingFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "GrantStatus" NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT,
    "notes" TEXT,
    "givingFundId" INTEGER NOT NULL,
    "ministryId" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "fundedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ministry_ein_key" ON "Ministry"("ein");

-- CreateIndex
CREATE INDEX "Ministry_category_idx" ON "Ministry"("category");

-- CreateIndex
CREATE INDEX "Ministry_verified_active_idx" ON "Ministry"("verified", "active");

-- CreateIndex
CREATE INDEX "Ministry_name_idx" ON "Ministry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "Donor"("email");

-- CreateIndex
CREATE INDEX "Donor_email_idx" ON "Donor"("email");

-- CreateIndex
CREATE INDEX "Donor_lastName_firstName_idx" ON "Donor"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "GivingFund_donorId_idx" ON "GivingFund"("donorId");

-- CreateIndex
CREATE INDEX "GivingFund_active_idx" ON "GivingFund"("active");

-- CreateIndex
CREATE INDEX "Grant_status_idx" ON "Grant"("status");

-- CreateIndex
CREATE INDEX "Grant_givingFundId_idx" ON "Grant"("givingFundId");

-- CreateIndex
CREATE INDEX "Grant_ministryId_idx" ON "Grant"("ministryId");

-- CreateIndex
CREATE INDEX "Grant_requestedAt_idx" ON "Grant"("requestedAt");

-- AddForeignKey
ALTER TABLE "GivingFund" ADD CONSTRAINT "GivingFund_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_givingFundId_fkey" FOREIGN KEY ("givingFundId") REFERENCES "GivingFund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grant" ADD CONSTRAINT "Grant_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "Ministry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
