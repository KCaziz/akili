-- AlterTable
ALTER TABLE `products` ADD COLUMN `address` VARCHAR(300) NULL,
    ADD COLUMN `category` VARCHAR(30) NULL,
    ADD COLUMN `ces` VARCHAR(50) NULL,
    ADD COLUMN `gabarit` VARCHAR(50) NULL,
    ADD COLUMN `reculMax` VARCHAR(50) NULL;

-- CreateIndex
CREATE INDEX `products_category_idx` ON `products`(`category`);
