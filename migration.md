# Plan de Implementación: Registro y Visualización de Estados Detallados de Mercado Pago

El objetivo es permitir a la aplicación guardar el `status` y `status_detail` originales enviados por Mercado Pago, mapeándolos a los 3 estados globales del sistema (`accepted`, `pending`, `cancelled`), y mostrarlos en los detalles del pago del comprador y del administrador para mejorar la experiencia de usuario y facilitar el soporte.

---

## Cambios Propuestos

### 1. Base de Datos (Prisma)

#### [MODIFY] [schema.prisma](file:///home/lautaro/Documentos/IAW/proyecto-c-payments-infusio/prisma/schema.prisma)
* Añadir los campos `mpStatus` y `mpStatusDetail` como campos de texto opcionales en el modelo `PaymentOrder`.
* Dejar el enum `PaymentStatus` sin cambios (`pending`, `accepted`, `cancelled`).

```prisma
model PaymentOrder {
  id               Int           @id @default(autoincrement())
  mercadoPagoId    String?       @map("mercado_pago_id")
  sellerAppOrderId String        @unique @map("seller_app_order_id")
  buyerId          String        @map("buyer_id")
  amount           Float
  status           PaymentStatus @default(pending)
  mpStatus         String?       @map("mp_status")        // <-- NUEVO
  mpStatusDetail   String?       @map("mp_status_detail") // <-- NUEVO
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  @@map("payment_order")
}
```

* **Acción requerida:** Generar y correr la migración de Prisma:
  ```bash
  npx prisma migrate dev --name add_mp_status_fields
  ```

---

### 2. Lógica del Webhook

#### [MODIFY] [route.ts](file:///home/lautaro/Documentos/IAW/proyecto-c-payments-infusio/app/api/payments/webhook/route.ts)
* Modificar la función `mapMercadoPagoStatus` para mapear todos los posibles estados de Mercado Pago a nuestros 3 estados internos (`accepted`, `pending`, `cancelled`), asegurándonos de que ningún webhook retorne un error de mapeo desconocido y se ignore.
* Actualizar la consulta de actualización de Prisma en el webhook para guardar también los campos `mpStatus` y `mpStatusDetail` recibidos en el payload de Mercado Pago.

```typescript
function mapMercadoPagoStatus(mpStatus: string): PaymentStatus {
  const statusMap: Record<string, PaymentStatus> = {
    // Aceptado / Exitoso
    approved: "accepted",
    processed: "accepted",

    // Pendiente
    pending: "pending",
    in_process: "pending",
    processing: "pending",
    in_review: "pending",
    created: "pending",
    action_required: "pending",

    // Cancelado / Fallido / Revertido
    rejected: "cancelled",
    failed: "cancelled",
    cancelled: "cancelled",
    canceled: "cancelled",
    refunded: "cancelled",
    charged_back: "cancelled",
    expired: "cancelled",
  };

  return statusMap[mpStatus] ?? "pending";
}
```

---

### 3. Vistas de Detalle (UI)

Añadiremos etiquetas descriptivas del estado de Mercado Pago para mostrar de manera comprensible al usuario lo que sucedió.

#### [MODIFY] [page.tsx](file:///home/lautaro/Documentos/IAW/proyecto-c-payments-infusio/app/(auth)/dashboard/payments/[paymentOrderId]/page.tsx) (Admin/Buyer View)
* Mostrar el `mpStatus` y el `mpStatusDetail` en la sección de detalles del pago si están disponibles.
* Usar un diccionario de traducción amigable para convertir códigos como `insufficient_amount` a *"Fondos insuficientes"*, etc.

#### [MODIFY] [page.tsx](file:///home/lautaro/Documentos/IAW/proyecto-c-payments-infusio/app/(auth)/(buyer)/payments/status/[paymentOrderId]/page.tsx) (Buyer Status View)
* Mostrar de forma destacada al comprador el motivo del fallo si el pago está cancelado/fallido, mejorando su experiencia.

---

## Plan de Verificación

### Pruebas Automatizadas/Manuales
1. Ejecutar las migraciones de base de datos localmente.
2. Levantar el servidor de desarrollo y verificar que compila correctamente (`npm run dev`).
3. Probar el webhook enviando payloads simulados con diferentes estados (ej. `status: "failed", status_detail: "insufficient_amount"`) y verificar que:
   - Se registre en la base de datos como `cancelled` con `mpStatusDetail: "insufficient_amount"`.
   - Se visualice correctamente en las páginas de detalle tanto de admin como de comprador.
