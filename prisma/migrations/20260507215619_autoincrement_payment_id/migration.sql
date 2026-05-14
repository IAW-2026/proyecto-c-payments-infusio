/*
  Warnings:

  - The primary key for the `payment_order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `payment_order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payment_order" DROP CONSTRAINT "payment_order_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "payment_order_pkey" PRIMARY KEY ("id");
