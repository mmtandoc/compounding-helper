-- CreateTable
CREATE TABLE "directory" (
    "url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" SERIAL NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directory_pkey" PRIMARY KEY ("url")
);
