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
        "user_id": "string",
        "cart_items": [
            {
                "id": "string",
                "cart_id": "string",
                "product_id": "string",
                "product_name": "string",
                "product_variant": "string",
                "product_image_url": "string",
                "price_at_time": "decimal",
                "quantity": "int"
            }
        ],
        "address": {
            "street": "string",
            "city": "string",
            "province": "string",
            "postal_code": "string",
        }
    }
    ```
- **Response:**
    ```json
    {
        "purchase_order_id": "po_738219465",
        "user_id": "user_2Niz9KxWLxt6Vp7bN4C5aK8jX3a",
        "shopping_cart_id": "cart_abc123xyz",
        "status": "pending",
        "created_at": "2026-05-29T12:48:00.000Z",
        "shipping_id": "ship_987654321",
        "payment_id": null,
        "payment_url": "https://buyer-app-domain.com/api/payments/payment-url?order_id=po_738219465&amount=15500",
        "shipping_cost": 1500,
        "currency": "ARS",
        "address": "Av. Alem 1250, Bahía Blanca, Buenos Aires, Argentina",
        "cart_items": [
            {
                "id": "item-0",
                "cart_id": "cart_abc123xyz",
                "product_id": "prod_coffee_brazil_01",
                "product_name": "Café de Especialidad Brasil Alfenas",
                "product_variant": "Molido - Filtro",
                "product_image_url": "https://buyer-app-domain.com/images/products/brasil-alfenas.png",
                "price_at_time": 12000,
                "quantity": 1
            },
            {
                "id": "item-1",
                "cart_id": "cart_abc123xyz",
                "product_id": "prod_tea_earl_grey",
                "product_name": "Té Hebras Earl Grey Premium",
                "product_variant": null,
                "product_image_url": null,
                "price_at_time": 2000,
                "quantity": 1
            }
        ]
    }
    ```
- **Quién llama a quién:** Buyer App → Seller App


### Obtener todas las órdenes de compra de un usuario
- **Endpoint:** `GET /api/seller/purchase_orders?user_id={user_id}`
- **Request:** -
- **Response:**
    ```json
    {
        "orders": [
            {
                "purchase_order_id": "string",
                "user_id": "string",
                "shopping_cart_id": "string",
                "status": "string",
                "created_at": "string (ISO 8601)",
                "shipping_id": "string | null",
                "payment_id": "string | null",
                "payment_url": "string",
                "shipping_cost": 0.0,
                "currency": "ARS",
                "address": {
                    "street": "string",
                    "city": "string"
                },
                "cart_items": [
                    {
                        "id": "string",
                        "cart_id": "string",
                        "product_id": "string",
                        "product_name": "string",
                        "product_variant": "string | null",
                        "product_image_url": "string | null",
                        "price_at_time": 0.0,
                        "quantity": 0
                    }
                ]
            }
        ]
    }
    ```
- **Quién llama a quién:** Buyer App → Seller App


### Obtener el detalle de una orden de compra
- **Endpoint:** `GET /api/seller/purchase_orders/{id}`
- **Request:** -
- **Response:**
    ```json
    {
        "purchase_order_id": "string",
        "user_id": "string",
        "shopping_cart_id": "string",
        "status": "string",
        "created_at": "string (ISO 8601)",
        "shipping_id": "string | null",
        "payment_id": "string | null",
        "payment_url": "string",
        "shipping_cost": 0.0,
        "currency": "ARS",
        "address": {
            "street": "string",
            "city": "string"
        },
        "cart_items": [
            {
                "id": "string",
                "cart_id": "string",
                "product_id": "string",
                "product_name": "string",
                "product_variant": "string | null",
                "product_image_url": "string | null",
                "price_at_time": 0.0,
                "quantity": 0
            }
        ]
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

---

## Shipping App — Endpoints expuestos
### Cotización de envío
- **Endpoint:** `POST /api/shipping/cost`
- **Request:** la app que consume este endpoint envía el origen y el destino del envío para que Shipping App calcule el costo correspondiente.
    ```json
    {
        "origin_postal_code": "string",
        "destination_postal_code": "string"
    }
    ```
- **Response:** Shipping App responde el costo estimado del envío calculado a partir de los dos destinos recibidos.
    ```json
    {
        "shipping_cost": 0,
        "currency": "ARS"
    }
    ```
- **Quién llama a quién:** Buyer App consume el endpoint `POST /api/shipping/cost` expuesto por Shipping App.

### Seguimiento del envío
- **Endpoint:** `GET /api/shipping/{shipping_id}`
- **Request:** sin req body; {shipping_id} es suficiente.
- **Response:** Shipping App responde el estado actual del envío junto con información básica de seguimiento.
    ```json
    {
        "shipping_id": "string",
        "status": "CONFIRMED | PREPARING | IN_TRANSIT | ARRIVED_CITY | OUT_FOR_DELIVERY | DELIVERED | CANCELLED | WITH_ISSUE",
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
          "seller_id": "string",
          "origin_address": {
            "address": "string",
            "postal_code": "string",
          },
          "destination_address": {
            "address": "string",
            "postal_code": "string",
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
- **Quién llama a quién:** Seller App y Buyer App consumen este endpoint de Shipping App.


### Actualización de estado de envío
- **Endpoint:** `PATCH /api/shipping/status-update/{shipping_id}`
- **Request:** la app que consume este endpoint envía el nuevo estado del envío.
    ```json
    {
        "status": "CONFIRMED | PREPARING | CANCELLED | WITH_ISSUE",
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
