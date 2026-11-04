-- ============================================================================
-- Akili — Mise à jour Phase 5 (galerie par bien, filtres, carte, badges, vidéo,
-- vedette, avis clients, paramètres, alertes, statistiques)
--
-- À exécuter UNE SEULE FOIS sur la base de PRODUCTION EXISTANTE, AVANT de déployer
-- le nouveau code : phpMyAdmin > [votre base] > onglet SQL > coller > Exécuter.
-- Faites d'abord un export de la base (phpMyAdmin > Exporter) par sécurité.
--
-- Non destructif : ajoute des colonnes/tables, ne supprime rien. Chaque photo
-- actuelle d'un bien devient sa première photo. Les prix numériques sont
-- déduits automatiquement des prix texte au premier démarrage du serveur.
-- ============================================================================

-- AlterTable
ALTER TABLE `products` ADD COLUMN `isExclusive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL,
    ADD COLUMN `priceValue` INTEGER NULL,
    ADD COLUMN `status` ENUM('DISPONIBLE', 'VENDU', 'LOUE') NOT NULL DEFAULT 'DISPONIBLE',
    ADD COLUMN `videoUrl` TEXT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `product_images` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `product_images_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `text` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_alerts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `type` ENUM('VENTE', 'LOCATION') NULL,
    `city` VARCHAR(191) NULL,
    `maxBudget` INTEGER NULL,
    `minRooms` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `products_type_idx` ON `products`(`type`);

-- CreateIndex
CREATE INDEX `products_isFeatured_idx` ON `products`(`isFeatured`);

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Reprise des données : la photo unique de chaque bien devient sa première photo.
INSERT INTO `product_images` (`id`, `productId`, `url`, `position`)
SELECT UUID(), `id`, `image`, 0 FROM `products` WHERE `image` IS NOT NULL AND `image` <> '';

-- Numéro WhatsApp jusqu'ici codé en dur dans le frontend.
INSERT IGNORE INTO `site_settings` (`key`, `value`) VALUES ('whatsappNumber', '213783940376');
