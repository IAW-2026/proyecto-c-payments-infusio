/*
  Warnings:

  - You are about to drop the column `checkout_url` on the `payment_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_order" DROP COLUMN "checkout_url";
