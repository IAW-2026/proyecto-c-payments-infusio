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
- phoneNumber    
- roles
- addresses
- favourite_products (lista de productos)
- carts (lista de carritos)
- purchaseOrders    

**Cart**
- id
- user_id
- status (NOT_CHECKED_OUT/CHECKED_OUT)
- items (lista de CartItem)

**CartItem**
- id
- cart_id
- product_id
- product_name
- product_variant (detalles del producto)
- product_image_url
- price_at_time
- quantity

**FavouriteProduct**
- user_id          
- product_id      
- product_name     
- product_image_url 
- price           
- location        
- categories      
- description     

**FavouriteShare**
- id    
- user_id   
- items (json)

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

**PaymentOrder** (`payment_order`):
- `id`
- `mercado_pago_id`
- `seller_app_order_id`
- `buyer_id`
- `amount`
- `status` (`pending`, `accepted`, `cancelled`)
- `mp_status`
- `mp_status_detail`
- `created_at`
- `updated_at`

> **Nota:** No existe una entidad `Dispute`. Los contracargos y reembolsos se reflejan en el `mp_status` (`charged_back`, `refunded`) y se mapean al estado `cancelled`.

---

## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Usuario (clerk_user_id) | Todas | Clerk | Cada app sincroniza al primer login vía webhook o lazy load |
| *(agregar otros)* | | | |
