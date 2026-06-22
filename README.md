[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ks7Ywtwc)
# Infusio — Payments App

🔗 **Deploy de producción:** [proyecto-c-payments-infusio.vercel.app](https://proyecto-c-payments-infusio.vercel.app)

---

## Usuarios disponibles para pruebas

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@infusio.com | Infusio2024! |
| Comprador | buyer+clerk_test@iaw.com | iawuser# |

---

## Instrucciones para utilizar la aplicación

1. **Acceder al deploy** en [proyecto-c-payments-infusio.vercel.app](https://proyecto-c-payments-infusio.vercel.app).
2. **Iniciar sesión** con alguno de los usuarios de prueba listados arriba.
3. **Panel de Administrador:** Permite ver todas las órdenes de pago, filtrarlas por estado, y cambiar el estado manualmente (útil para simular aprobaciones en el Sandbox de Mercado Pago).
4. **Vista de Comprador:** Permite ver las órdenes propias, su estado actual y el link de pago de Mercado Pago para las órdenes pendientes.
5. **Flujo de pago:** Desde la vista de comprador, hacer clic en "Pagar" en una orden pendiente redirige al checkout de Mercado Pago (Sandbox). Al completar el pago con tarjeta de prueba, el webhook actualiza el estado automáticamente.

Para más detalles sobre las tarjetas de prueba y los flujos de Sandbox, ver [TESTING.md](./TESTING.md).

### Links de pago preconfigurados (Sandbox)

Órdenes pendientes cargadas con el usuario `buyer+clerktest@iaw.com`. Se puede iniciar el pago directamente desde estos links:

- **Orden #30** ($2500): [Iniciar Pago #30](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-797324e6-9f8f-4fb8-abe8-63a4dc103d53)
- **Orden #31** ($1800): [Iniciar Pago #31](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-fa189c42-df2c-448d-bdaa-d289e4816d44)
- **Orden #32** ($4200): [Iniciar Pago #32](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-83c9ba60-bdc7-4fe1-845a-4a706410bcb0)
- **Orden #33** ($990): [Iniciar Pago #33](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-00bddc4d-cb06-4bc8-a050-ddd213a189fc)
- **Orden #34** ($3100): [Iniciar Pago #34](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-76d2d5ba-75b0-4ed9-8cab-137c6d5a45c4)

---

## Descripción del proyecto

**Infusio Payments** es el módulo de pagos del ecosistema Infusio, un marketplace de té, café e infusiones de especialidad. Se encarga de coordinar el flujo de cobro entre el vendedor, el comprador y Mercado Pago: recibe solicitudes de pago desde la Seller App, procesa las notificaciones del webhook de Mercado Pago y actualiza el estado de las órdenes.

La aplicación expone una API REST bajo `/api/payments/` que es consumida por las demás apps del ecosistema. Incluye un **panel de administración** para gestionar y monitorear todos los pagos, y una **vista para el comprador** donde puede consultar el estado de sus transacciones e iniciar el checkout.

La autenticación está implementada con Clerk, el ORM con Prisma sobre PostgreSQL, y la integración de pagos con el SDK oficial de Mercado Pago en modo Sandbox.

---

## Notas para la corrección

- **Sandbox de Mercado Pago:** Al simular pagos offline (efectivo/Rapipago), la orden queda como `pending`. Para simular la aprobación, usar el panel de administrador para cambiar el estado manualmente; esto también notifica a la Seller App. Los pagos con tarjeta de prueba se aprueban automáticamente vía webhook.
- **Webhook:** El endpoint `POST /api/payments/webhook` valida la notificación consultando directamente a la API de Mercado Pago antes de actualizar el estado, lo que garantiza idempotencia y seguridad.
- **Notificación a la Seller App:** Cuando un administrador cambia el estado de una orden manualmente, la app notifica a la Seller App del grupo mediante una llamada HTTP al endpoint correspondiente.
- **Datos precargados:** La base de datos cuenta con órdenes en distintos estados (`pending`, `approved`, `rejected`, `cancelled`) para poder recorrer todos los casos de uso desde el primer acceso.

---

## API Reference

Endpoints bajo `/api/payments/`. Los que se comunican entre apps usan autenticación por secreto compartido (`x-api-key` header).

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| `POST` | `/api/payments/charge` | `x-api-key` | Crea una orden de pago y retorna la URL de checkout de Mercado Pago. Acepta `PAYMENTS_API_KEY` o `CONTROL_API_KEY`. |
| `GET` | `/api/payments/status/:id` | `x-api-key` | Retorna el estado actual de una orden |
| `PATCH` | `/api/payments/:id/status` | Clerk (admin) | Override manual de estado (`pending`, `accepted`, `cancelled`) |
| `POST` | `/api/payments/webhook` | — | Recibe notificaciones de Mercado Pago |
| `GET` | `/api/payments/orders` | `x-api-key` | Lista órdenes con paginación y filtros (`page`, `limit`, `status`, `buyerId`). Auth: `CONTROL_API_KEY`. |
| `GET` | `/api/payments/orders/:id` | `x-api-key` | Detalle completo de una orden. Auth: `CONTROL_API_KEY`. |
| `PUT` | `/api/payments/orders/:id` | `x-api-key` | Actualiza campos de una orden. Auth: `CONTROL_API_KEY`. |
| `DELETE` | `/api/payments/orders/:id` | `x-api-key` | Elimina una orden. Auth: `CONTROL_API_KEY`. |
