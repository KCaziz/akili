-- ============================================================================
-- Akili — Mise à jour de la base EXISTANTE (novembre 2026)
--
-- À exécuter une fois dans phpMyAdmin > [votre base] > onglet SQL > Exécuter,
-- si la base a été créée avec une version précédente de base-de-donnees.sql.
-- Le script peut être relancé sans risque : chaque étape vérifie si elle a
-- déjà été appliquée. Aucune donnée existante n'est supprimée.
--
-- Contenu :
--   - NIN (numéro d'identification national) sur les demandes et offres de vente
--   - e-mail sur les offres de vente
--   - plusieurs photos / vidéos par bien (table product_media)
-- ============================================================================

ALTER TABLE `client_requests` ADD COLUMN IF NOT EXISTS `nationalId` VARCHAR(18) NOT NULL DEFAULT '';
ALTER TABLE `sell_offers` ADD COLUMN IF NOT EXISTS `nationalId` VARCHAR(18) NOT NULL DEFAULT '';
ALTER TABLE `sell_offers` ADD COLUMN IF NOT EXISTS `email` VARCHAR(191) NULL AFTER `phone`;

CREATE TABLE IF NOT EXISTS `product_media` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('PHOTO', 'VIDEO') NOT NULL,
    `url` TEXT NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `product_media_productId_idx`(`productId`),
    PRIMARY KEY (`id`),
    CONSTRAINT `product_media_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- L'image actuelle de chaque bien devient sa première photo (uniquement pour
-- les biens qui n'ont encore aucun média).
INSERT INTO `product_media` (`id`, `productId`, `type`, `url`, `position`)
SELECT CONCAT('pm_', p.`id`), p.`id`, 'PHOTO', p.`image`, 0
FROM `products` p
WHERE p.`image` IS NOT NULL AND p.`image` <> ''
  AND NOT EXISTS (SELECT 1 FROM `product_media` m WHERE m.`productId` = p.`id`);
