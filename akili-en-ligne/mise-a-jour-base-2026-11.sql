-- ============================================================================
-- Akili — Mise à jour de la base de PRODUCTION EXISTANTE (novembre 2026)
--
-- À exécuter dans phpMyAdmin > [votre base] > onglet SQL > Exécuter, AVANT de
-- déployer le nouveau code. Faites d'abord un export (phpMyAdmin > Exporter).
--
-- Ce script regroupe TOUTES les évolutions depuis la V1 en ligne :
--   - NIN (numéro d'identification national) sur les demandes et offres
--   - Phase 5 : prix numérique, statut, exclusivité, vedette, position sur la
--     carte, compteur de vues, plusieurs photos par bien, avis clients,
--     paramètres du site, alertes visiteurs
--   - e-mail sur les offres de vente
--   - plusieurs vidéos par bien (table product_videos, remplace videoUrl)
--
-- Il peut être lancé sur une base V1, sur une base où l'ancien script
-- « mise-a-jour-phase5.sql » a déjà été passé, et même relancé : chaque étape
-- vérifie si elle a déjà été appliquée. Aucune donnée existante n'est perdue.
-- Nécessite MariaDB (syntaxe « IF NOT EXISTS »).
-- ============================================================================

-- --- NIN ---------------------------------------------------------------------
ALTER TABLE `client_requests` ADD COLUMN IF NOT EXISTS `nationalId` VARCHAR(18) NOT NULL DEFAULT '';
ALTER TABLE `sell_offers` ADD COLUMN IF NOT EXISTS `nationalId` VARCHAR(18) NOT NULL DEFAULT '';
-- La valeur vide ne sert qu'aux lignes existantes ; les nouvelles demandes fournissent toujours un NIN.
ALTER TABLE `client_requests` ALTER COLUMN `nationalId` DROP DEFAULT;
ALTER TABLE `sell_offers` ALTER COLUMN `nationalId` DROP DEFAULT;

-- --- E-mail des offres de vente ----------------------------------------------
ALTER TABLE `sell_offers` ADD COLUMN IF NOT EXISTS `email` VARCHAR(191) NULL AFTER `phone`;

-- --- Phase 5 : colonnes des biens ---------------------------------------------
ALTER TABLE `products`
    ADD COLUMN IF NOT EXISTS `isExclusive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS `latitude` DOUBLE NULL,
    ADD COLUMN IF NOT EXISTS `longitude` DOUBLE NULL,
    ADD COLUMN IF NOT EXISTS `priceValue` INTEGER NULL,
    ADD COLUMN IF NOT EXISTS `status` ENUM('DISPONIBLE', 'VENDU', 'LOUE') NOT NULL DEFAULT 'DISPONIBLE',
    ADD COLUMN IF NOT EXISTS `views` INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS `products_type_idx` ON `products`(`type`);
CREATE INDEX IF NOT EXISTS `products_isFeatured_idx` ON `products`(`isFeatured`);

-- --- Phase 5 : nouvelles tables -----------------------------------------------
CREATE TABLE IF NOT EXISTS `product_images` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `product_images_productId_idx`(`productId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `text` TEXT NOT NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `search_alerts` (
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

-- La photo actuelle de chaque bien devient sa première photo (seulement pour
-- les biens qui n'ont encore aucune photo dans product_images).
INSERT INTO `product_images` (`id`, `productId`, `url`, `position`)
SELECT UUID(), p.`id`, p.`image`, 0
FROM `products` p
WHERE p.`image` IS NOT NULL AND p.`image` <> ''
  AND NOT EXISTS (SELECT 1 FROM `product_images` i WHERE i.`productId` = p.`id`);

-- Numéro WhatsApp jusqu'ici codé en dur dans le site (modifiable ensuite dans
-- l'admin > Paramètres du site).
INSERT IGNORE INTO `site_settings` (`key`, `value`) VALUES ('whatsappNumber', '213783940376'), ('contactEmail', 'contact@akili-immobilier.com');

-- --- Vidéos multiples par bien ------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_videos` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,

    INDEX `product_videos_productId_idx`(`productId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `product_videos_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Si le script Phase 5 avait déjà été passé, la vidéo unique (videoUrl) de
-- chaque bien est reprise comme première vidéo, puis l'ancienne colonne est
-- supprimée. (La colonne est d'abord créée si elle n'existe pas, pour que le
-- script fonctionne dans tous les cas.)
ALTER TABLE `products` ADD COLUMN IF NOT EXISTS `videoUrl` TEXT NULL;

INSERT IGNORE INTO `product_videos` (`id`, `productId`, `url`, `position`)
SELECT CONCAT('pv_', `id`), `id`, `videoUrl`, 0
FROM `products`
WHERE `videoUrl` IS NOT NULL AND `videoUrl` <> '';

ALTER TABLE `products` DROP COLUMN IF EXISTS `videoUrl`;
