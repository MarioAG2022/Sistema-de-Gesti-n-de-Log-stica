-- AlterTable
ALTER TABLE `customer` ADD COLUMN `email` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `address` VARCHAR(191) NULL;
