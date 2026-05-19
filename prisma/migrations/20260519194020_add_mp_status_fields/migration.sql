/*
  Warnings:

  - You are about to drop the column `buyer_app_id` on the `payment_order` table. All the data in the column will be lost.
  - You are about to drop the column `seller_app_id` on the `payment_order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seller_app_order_id]` on the table `payment_order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment_order" DROP COLUMN "buyer_app_id",
DROP COLUMN "seller_app_id",
ADD COLUMN     "mp_status" TEXT,
ADD COLUMN     "mp_status_detail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_order_seller_app_order_id_key" ON "payment_order"("seller_app_order_id");
