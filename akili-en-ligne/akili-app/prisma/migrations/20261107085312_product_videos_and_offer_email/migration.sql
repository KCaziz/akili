-- AlterTable
ALTER TABLE `sell_offers` ADD COLUMN `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `product_videos` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `product_videos_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_videos` ADD CONSTRAINT `product_videos_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Reprise des données : l'ancienne vidéo unique d'un bien devient sa première vidéo.
INSERT INTO `product_videos` (`id`, `productId`, `url`, `position`)
SELECT CONCAT('pv_', `id`), `id`, `videoUrl`, 0 FROM `products` WHERE `videoUrl` IS NOT NULL AND `videoUrl` <> '';

-- AlterTable
ALTER TABLE `products` DROP COLUMN `videoUrl`;
