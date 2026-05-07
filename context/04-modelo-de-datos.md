# 1.4 — Modelo de Datos por Aplicación

> **Tipo C — Marketplace**

Para cada webapp, describir las entidades principales de su base de datos: tablas, campos relevantes y relaciones. No es necesario un DER formal, pero sí que quede claro qué persiste cada app.

También identificar posibles duplicados entre apps (ej: usuarios) y definir cómo se resuelven las inconsistencias.

---

## Buyer App

### Entidades principales

**User**
- id (clerk_user_id)
- name
- last_name
- email
- addresses
- favourite_products (lista de productos)
- carts (lista de carritos)

**Cart**
- id
- user_id
- products (lista de productos)

**Purchase Order**
- id
- app_id
- cart_id
- user_id
- user_address
- date/time
- state
- packages (lista de paquetes)

**Purchase**
- id
- app_id
- cart_id
- user_id
- date/time
- state
- packages (lista de paquetes)
- shipping_ids (uno por paquete)
- payment_id
- dispute_id

---

## Seller App

### Entidades principales

Puede existir duplicación con la entidad `Product` de Buyer App

**Artículo**
- idArticulo
- idVendedor (Clerk user ID)
- nombre
- descripcion
- categoria
- precio
- stock
- imagen

**Comprador**
- idComprador (Clerk user ID)
- nombre
- apellido
- email

**Orden de Compra**
- idOrdenCompra
- idAppCompra
- idComprador
- idCarrito
- fechaHora
- direccion_comprador
- estadoOrdenCompra
- idShipping (cargado por Shipping App)
- idPago (generado al iniciar el proceso de pago con Payments App)
- packages (lista de paquetes)

**Paquete**
- idPaquete
- idOrdenCompra
- idVendedor
- idComprador
- monto
- montoEnvio
- idShipping (cargado por Shipping App)

**Artículos Paquete**
- idArticulosPaquete
- idPaquete
- idArticulo
- precioUnitario
- cantidad
- subtotal

---

## Shipping App

### Entidades principales

**Shipment**
- id (número de orden)
- origin
- destination
- origin_datetime
- final_datetime
- status

**LogisticOperator**
- id
- name
- email
- shipment_id[] (todos los shipments asignados a la gestión de este LO)

**Rider**
- id
- name
- email
- status (activo / no activo)
- location

**ShipmentTracking**
- id
- shipment_id
- status
- datetime
- current_city
- next_city/destination (podría ser misma ciudad y próximo a entrega en domicilio/punto de entrega)

**ShipmentHistory**
- id
- shipment_id
- visited_cities[] (current_city para todo ShipmentTracking con shipment_id=shipment_id)

**User**
- id
- name
- surname
- mail
- role
- shipments[]

**DeliveryAssignment**
- rider_id
- shipment_id

---

## Payments App

### Entidades principales

<!-- Describir tablas y campos -->
**PaymentOrder:**
- id
- id_mercado_pago
- source_app_order_id
- source_app_id
- buyer_app_id
- buyer_id
- amount
- status (pending, accepted, cancelled)
- created_at
- updated_at

---

### Entidades principales

<!-- Describir tablas y campos -->

---

## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Usuario (clerk_user_id) | Todas | Clerk | Cada app sincroniza al primer login vía webhook o lazy load |
| *(agregar otros)* | | | |
