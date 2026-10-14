-- AlterTable
-- Existing rows (test data created before this field existed) get a placeholder
-- value so the column can be added as NOT NULL without a default going forward.
ALTER TABLE `client_requests` ADD COLUMN `nationalId` VARCHAR(18) NOT NULL DEFAULT '000000000000000000';
ALTER TABLE `client_requests` ALTER COLUMN `nationalId` DROP DEFAULT;

-- AlterTable
ALTER TABLE `sell_offers` ADD COLUMN `nationalId` VARCHAR(18) NOT NULL DEFAULT '000000000000000000';
ALTER TABLE `sell_offers` ALTER COLUMN `nationalId` DROP DEFAULT;
