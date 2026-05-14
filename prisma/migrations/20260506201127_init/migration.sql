-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'accepted', 'cancelled');

-- CreateTable
CREATE TABLE "payment_order" (
    "id" TEXT NOT NULL,
    "mercado_pago_id" TEXT,
    "seller_app_order_id" TEXT NOT NULL,
    "seller_app_id" TEXT NOT NULL,
    "buyer_app_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_order_pkey" PRIMARY KEY ("id")
);
