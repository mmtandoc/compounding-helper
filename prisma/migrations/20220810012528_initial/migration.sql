-- CreateTable
CREATE TABLE "chemicals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "casNumber" TEXT NOT NULL,
    "synonyms" TEXT[],
    "nioshTable" INTEGER NOT NULL DEFAULT -1,
    "nioshRevisionDate" TIMESTAMP(3),

    CONSTRAINT "chemicals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chemicalId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_data_sheets" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "revisionDate" TIMESTAMP(3) NOT NULL,
    "hmisHealthHazard" INTEGER NOT NULL,
    "requireVentilation" BOOLEAN NOT NULL,
    "filename" TEXT NOT NULL,

    CONSTRAINT "safety_data_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hazard_classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "hazard_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hazard_categories" (
    "id" SERIAL NOT NULL,
    "hazardClassId" INTEGER NOT NULL,
    "parentLevel" TEXT,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "hazard_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hazard_category_to_sds" (
    "id" SERIAL NOT NULL,
    "sdsId" INTEGER NOT NULL,
    "hazardCategoryId" INTEGER NOT NULL,
    "additionalInfo" TEXT,

    CONSTRAINT "hazard_category_to_sds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chemicals_casNumber_key" ON "chemicals"("casNumber");

-- CreateIndex
CREATE UNIQUE INDEX "safety_data_sheets_productId_revisionDate_key" ON "safety_data_sheets"("productId", "revisionDate");

-- CreateIndex
CREATE UNIQUE INDEX "hazard_categories_hazardClassId_level_key" ON "hazard_categories"("hazardClassId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "hazard_category_to_sds_sdsId_hazardCategoryId_additionalInf_key" ON "hazard_category_to_sds"("sdsId", "hazardCategoryId", "additionalInfo");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_chemicalId_fkey" FOREIGN KEY ("chemicalId") REFERENCES "chemicals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_data_sheets" ADD CONSTRAINT "safety_data_sheets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hazard_categories" ADD CONSTRAINT "hazard_categories_hazardClassId_fkey" FOREIGN KEY ("hazardClassId") REFERENCES "hazard_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hazard_categories" ADD CONSTRAINT "hazard_categories_hazardClassId_parentLevel_fkey" FOREIGN KEY ("hazardClassId", "parentLevel") REFERENCES "hazard_categories"("hazardClassId", "level") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hazard_category_to_sds" ADD CONSTRAINT "hazard_category_to_sds_sdsId_fkey" FOREIGN KEY ("sdsId") REFERENCES "safety_data_sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hazard_category_to_sds" ADD CONSTRAINT "hazard_category_to_sds_hazardCategoryId_fkey" FOREIGN KEY ("hazardCategoryId") REFERENCES "hazard_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
