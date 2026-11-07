-- AlterTable
ALTER TABLE `sell_offers` ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `product_media` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('PHOTO', 'VIDEO') NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `product_media_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_media` ADD CONSTRAINT `product_media_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: the existing single image of each product becomes its first photo.
INSERT INTO `product_media` (`id`, `productId`, `type`, `url`, `position`)
SELECT CONCAT('pm_', `id`), `id`, 'PHOTO', `image`, 0 FROM `products` WHERE `image` IS NOT NULL AND `image` <> '';
