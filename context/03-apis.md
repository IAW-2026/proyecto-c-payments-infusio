# 1.3 — Diseño de APIs Inter-Servicios

> **Tipo C — Marketplace**

Documentar cada endpoint que una app expone para ser consumido por otra app del sistema. Este contrato debe estar acordado por todos los integrantes antes de comenzar la Etapa 2.

---

## Buyer App — Endpoints expuestos

<!-- En este caso Buyer App no expone endpoints consumidos por otras apps -->


---

## Seller App — Endpoints expuestos

### Creación de orden de compra
- **Endpoint:** `POST /api/seller/purchase_order`
- **Request:**
    ```json
    {
        "shopping_cart_id": "string",
        "user_id": "string"
    }
    ```
- **Response:**
    ```json
    {
        "purchase_order_id": "string"
    }
    ```
- **Quién llama a quién:** Buyer App → Seller App


### Obtener todos los productos
- **Endpoint:** `GET /api/seller/products`
- **Request:** -
- **Response:**
    ```json
    {
        "products": []
    }
    ```
- **Quién llama a quién:** Buyer App → Seller App


### Obtener un producto
- **Endpoint:** `GET /api/seller/product/{id_product}`
- **Request:**
    ```json
    {
        "id_product": "string"
    }
    ```
- **Response:**
    ```json
    {
        "product": {}
    }
    ```
- **Quién llama a quién:** Buyer App → Seller App


### Notificación de pago confirmado
- **Endpoint:** `POST /api/orders/{source_app_order_id}/payment-confirmed`
- **Request:**
    ```json
    {
        "payment_order_id": "string",
        "status": "accepted | cancelled"
    }
    ```
- **Response:**
    ```json
    {
        "ok": true
    }
    ```
- **Quién llama a quién:** Payments App → Seller App

### URL de pago de la orden de compra
- **Endpoint:** 'GET /api/seller/orders/{idOrdenCompra}/payment-url
- **Request:** -
- **Response:**
```json
    {
        "payment_order_id": "string",
        "checkout_url": "string"
    }
```
- **Quién llama a quién:** Buyer App → Seller App

---

## Shipping App — Endpoints expuestos
### Cotización de envío
- **Endpoint:** `POST /api/shipping/cost`
- **Request:** la app que consume este endpoint envía el origen y el destino del envío para que Shipping App calcule el costo correspondiente.
    ```json
    {
        "origin_postal_code": "string",
        "destination_postal_code": "string"
    }```
- **Response:** Shipping App responde el costo estimado del envío calculado a partir de los dos destinos recibidos.
    ```json
    {
        "shipping_cost": 0,
        "currency": "ARS"
    }```
- **Quién llama a quién:** Buyer App consume el endpoint `POST /api/shipping/cost` expuesto por Shipping App.

### Seguimiento del envío
- **Endpoint:** `GET /api/shipping/{shipping_id}`
- **Request:** la app que consume este endpoint envía el identificador del envío para consultar su estado actual.
    ```json
    {
        "shipping_id": "string"
    }
    ```
- **Response:** Shipping App responde el estado actual del envío junto con información básica de seguimiento.
    ```json
    {
        "shipping_id": "string",
        "status": "pending | prepared | dispatched | in_transit | delivered | cancelled | incident",
        "last_update": "datetime",
        "current_city": "string"
    }
    ```
- **Quién llama a quién:** Buyer App y Seller App consumen el endpoint `GET /api/shipping/{shipping_id}` expuesto por Shipping App.

### Creación de envío
- **Endpoint:** `POST /api/shipping`
- **Request:** la app que consume este endpoint envía los datos necesarios para crear un envío asociado a una orden.
    ```json
    {
        "order_id": "string",
        "buyer_id": "string",
        "origin_address": {
            "address": "string",
            "postal_code": "string"
        },
        "destination_address": {
            "address": "string",
            "postal_code": "string"
        }
    }
    ```
- **Response:**
    ```json
    {
        "shipping_id": "string",
        "status": "pending"
    }
    ```
- **Quién llama a quién:** Buyer App consume este endpoint de Shipping App.


### Actualización de estado de envío
- **Endpoint:** `PATCH /api/shipping/status-update/{shipping_id}`
- **Request:** la app que consume este endpoint envía el nuevo estado del envío.
    ```json
    {
        "status": "prepared | dispatched | delivered | cancelled | incident"
    }
    ```
- **Response:**
    ```json
    {
        "shipping_id": "string",
        "status": "string"
    }
    ```
- **Quién llama a quién:** Seller App (o sistema logístico) consume este endpoint de Shipping App.

---

## Payments App — Endpoints expuestos

<!-- Documentar los endpoints que expone esta app -->
### Iniciar cobro
- **Endpoint:** `POST /api/payments/charge`
- **Request:**
    ```json
    {
        "seller_app_id": "string",
        "seller_app_order_id": "string",
        "buyer_app_id": "string",
        "buyer_id": "string",
        "amount": float
    }
    ```
- **Quién llama a quién:** Seller App → Payments App
- **Response:**
    ```json
    {
        "payment_order_id": "string",
        "checkout_url": "string"
    }
    ```


### Consultar estado de pago
- **Endpoint:** `GET /api/payments/status/{payment_order_id}`
- **Request:** -
- **Quién llama a quién:** Seller App → Payments App
- **Response:**
    ```json
    {
        "status": "string"
    }
    ```

### Recibir notificación de pago
- **Endpoint** `POST /api/payments/webhook`
- **Request**
  ```
    json    {
            "payment_id": "string",
            "status": "string"
        }

  ```
- **Quién llama a quién**: Mercado Pago → Payments App
- **Response**
    ```
        json    {
                "ok": true
            }
    ```
---

## Feedback App — Endpoints expuestos *(si aplica)*

<!-- Documentar los endpoints que expone esta app -->

---

<!-- Agregar secciones por cada integración adicional identificada -->


---
