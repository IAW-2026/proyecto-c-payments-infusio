import { PaymentStatus } from "@/lib/generated/prisma";

// POST /api/payments/charge — also used by Control Panel to create orders
export interface CreatePaymentOrderPayload {
  seller_app_order_id: string;
  buyer_id: string;
  amount: number;
}

// PUT /api/payments/orders/[id]
export interface UpdatePaymentOrderPayload {
  sellerAppOrderId?: string;
  buyerId?: string;
  amount?: number;
  status?: PaymentStatus;
  mercadoPagoId?: string | null;
}

// Standard API response shape for a single order
export interface PaymentOrderResponse {
  id: number;
  mercadoPagoId: string | null;
  sellerAppOrderId: string;
  buyerId: string;
  amount: number;
  status: PaymentStatus;
  mpStatus: string | null;
  mpStatusDetail: string | null;
  createdAt: string;
  updatedAt: string;
}

// Paginated list response
export interface PaginatedPaymentOrdersResponse {
  data: PaymentOrderResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
