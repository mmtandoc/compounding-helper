-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "mfrFieldPresets" JSONB NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
