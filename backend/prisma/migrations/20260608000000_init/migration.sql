-- CreateEnum
CREATE TYPE "NasaSource" AS ENUM ('MARS_ROVER', 'APOD', 'NASA_LIBRARY');

-- CreateEnum
CREATE TYPE "TagSource" AS ENUM ('MANUAL', 'AI_SUGGESTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nasa_images" (
    "id" TEXT NOT NULL,
    "nasaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "thumbUrl" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "source" "NasaSource" NOT NULL,
    "rover" TEXT,
    "camera" TEXT,
    "sol" INTEGER,
    "earthDate" TEXT,
    "mission" TEXT,
    "rawMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiDescription" TEXT,
    "aiCuriousFacts" TEXT,
    "aiAnalysis" TEXT,
    "aiEnrichedAt" TIMESTAMP(3),

    CONSTRAINT "nasa_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_items" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_images" (
    "id" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "saved_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_tags" (
    "imageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "source" "TagSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_tags_pkey" PRIMARY KEY ("imageId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "nasa_images_nasaId_key" ON "nasa_images"("nasaId");

-- CreateIndex
CREATE INDEX "nasa_images_date_idx" ON "nasa_images"("date");

-- CreateIndex
CREATE INDEX "nasa_images_rover_idx" ON "nasa_images"("rover");

-- CreateIndex
CREATE INDEX "nasa_images_source_idx" ON "nasa_images"("source");

-- CreateIndex
CREATE UNIQUE INDEX "collection_items_collectionId_imageId_key" ON "collection_items"("collectionId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_images_userId_imageId_key" ON "saved_images"("userId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "nasa_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_images" ADD CONSTRAINT "saved_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_images" ADD CONSTRAINT "saved_images_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "nasa_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_tags" ADD CONSTRAINT "image_tags_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "nasa_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_tags" ADD CONSTRAINT "image_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
