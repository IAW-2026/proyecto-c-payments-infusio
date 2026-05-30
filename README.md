[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ks7Ywtwc)
# Infusio — Payments App

Aplicación **Payments** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — Tipo C (Marketplace) — Red Infusio.

> 🔗 **[proyecto-c-payments-infusio.vercel.app](https://proyecto-c-payments-infusio.vercel.app)**

---

## ¿Qué es esta app?

**Infusio Payments** es el módulo de pagos del ecosistema Infusio, un marketplace de té, café e infusiones de especialidad.

Se encarga de coordinar el flujo de cobro entre el vendedor, el comprador y Mercado Pago: recibe solicitudes de pago, procesa las notificaciones de Mercado Pago y actualiza el estado de las órdenes en el sistema.

Incluye un **panel de administración** para gestionar y monitorear los pagos, y una **vista para el comprador** donde puede consultar el estado de sus transacciones.

> [!NOTE]
> Esta es la **Etapa 2** del proyecto. La integración con la Seller App y la Buyer App está implementada pero aún no conectada de forma completa, ya que los demás servicios del grupo se encuentran en desarrollo. La única redirección que funciona es la del checkout de Mercado Pago a la Buyer App.

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | admin@infusio.com | Infusio2024! |
| Comprador | cliente@infusio.com | Infusio2024! |

### Órdenes de pago pendientes para probar (Mercado Pago Sandbox)

Para probar el flujo de pago con el usuario `cliente@infusio.com`, se crearon las siguientes órdenes de pago pendientes. Al hacer clic en los links e iniciar sesión con la cuenta de comprador de prueba de Mercado Pago (detallada en `TESTING.md`), se puede completar el pago:

- **Orden #21:** [Iniciar Pago #21](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-ef4c2078-1876-4d9b-b0a2-f843a1053abb)
- **Orden #23:** [Iniciar Pago #23](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-894187f1-a8bb-4fab-9302-aedece43728c)
- **Orden #24:** [Iniciar Pago #24](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-6cc93580-1f74-4102-b314-78e3f54c1e3d)
- **Orden #25:** [Iniciar Pago #25](https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=3382391175-98425fa3-08aa-4ef8-9f06-bb6cdd5bfb05)

> *Nota: Para las credenciales de comprador de prueba de Mercado Pago y las tarjetas de test, revisar el archivo [TESTING.md](file:///home/lautaro/Documentos/IAW/proyecto-c-payments-infusio/TESTING.md).*

---

## Limitaciones y Flujos de Test (Mercado Pago Sandbox)

Al realizar pruebas en el Sandbox de Mercado Pago, pueden ocurrir los siguientes comportamientos esperados debido a las restricciones de la API externa:

1. **Simulación de Pagos Offline (Efectivo/Pendiente):**
   - Si generás un ticket para Rapipago/Pago Fácil, la orden quedará como **Pendiente** en la app.
   - **Por qué simular el webhook no es suficiente:** Si intentás enviar un webhook falso indicando que el pago está aprobado (a través de Postman o del simulador de Mercado Pago), la orden no cambiará a aprobada. Por seguridad, al recibir la notificación, el backend de la app consulta directamente a la API oficial de Mercado Pago para corroborar el estado real de la transacción. Si el pago sigue pendiente del lado de Mercado Pago, la app mantendrá el estado como `pending`.
   - **Inconveniente del Sandbox:** Mercado Pago restringe la aprobación manual de transacciones de prueba mediante su API `PUT /v1/payments` si las credenciales de prueba del vendedor tienen formato de producción (`APP_USR-...`), respondiendo con error `401 Unauthorized use of live credentials`.
   - **Solución / Alternativa:** Para testear la transición de estado a **Aprobado** (o Cancelado), iniciá sesión con el usuario de Clerk **Administrador**, navegá al detalle de la orden en el panel de control (ej. `/dashboard/payments/21`) y cambialo manualmente usando el selector de estado. Esto actualizará la orden en la base de datos de Payments y notificará la confirmación a la Seller App.

2. **Pagos Directos con Tarjeta:**
   - Si elegís pagar directamente con tarjeta de crédito de prueba en el checkout, el pago se aprueba de forma automática y el webhook se dispara de inmediato en segundo plano, cambiando el estado a **Aprobado** de forma transparente.

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>
