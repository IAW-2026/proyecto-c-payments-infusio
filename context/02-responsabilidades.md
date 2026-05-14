# 1.2 — Asignación de Responsabilidades

> **Tipo C — Marketplace**

## Distribución de webapps

| App | Responsable | Repositorio |
|-----|-------------|-------------|
| Buyer App | Milagros Vives | `proyecto-c-buyer-[nombre]` |
| Seller App | Camila De Giusti | `proyecto-c-seller-[nombre]` |
| Shipping App | Ludmila Prolygin | `proyecto-c-shipping-[nombre]` |
| Payments App | Lautaro Emalhao | `proyecto-c-payments-[nombre]` |
---

## Datos propios de cada app

### Buyer App
**Responsable:** Milagros Vives


**Datos Propios (en qué base de datos vive cada entidad)**
- Datos de **User**:
    - Un user puede ser comprador y/o vendedor (flag para settear luego desde Seller)
    - Tiene un idUser
    - Tiene nombre, apellido
    - Tiene campos pendientes como número celular y direcciones
    - Tiene una lista de productos favoritos
    - Puede tener 0, 1 o más carritos
- Datos de **Carrito**:
    - Tiene un idCarrito
    - Tiene productos con cantidad especificada
        - idProducto → Cargado por Seller App
    - Tiene un estado (not checked out, checked out)
- Datos de **Orden de Compra**:
    - Tiene un idOrdenCompra
    - Tiene un idAppCompra
    - Tiene un idComprador
    - Tiene un userAddress
    - Tiene un idCarrito
    - Tiene una fecha/hora
    - Tiene un estadoOrdenCompra
    - Tiene muchos paquetes
- Datos de **Compra**:
    - Tiene un idCompra
    - Tiene un idAppCompra
    - Tiene un idComprador
    - Tiene un idCarrito
    - Tiene una fecha/hora
    - Tiene uno o más idShipping 
    - Tiene un idPago
    - Tiene un idDisputa


**Datos o acciones que requieren comunicación con otra app (y a través de qué API)**
- Carrito “check out” con datos del usuario    -- sent -->     Seller App
- Orden de compra creada                      -- received -->  Seller App
- Consulta estado seguimiento                  -- sent -->     Shipping App
- Solicitud detalles pago                      -- sent -->     Payments App 
- Pedir realizar pago                          -- sent -->     Payments App 
- idPago                                     -- received -->   Payments App
- idShipping                                 -- received -->   Seller App
- Inicializar disputa                          -- sent -->     Payments App 
- idDisputa                                  -- received -->   Payments App
- Consultar estado disputa                     -- sent -->     Payments App
- Solicitar producto/s                         -- sent -->     Seller App

### Seller App
**Responsable:** De Giusti Camila

#### Orden de Compra

| Campo | Descripción |
|---|---|
| `idOrdenCompra` | Identificador de la orden de compra |
| `idAppCompra` | Identificador de la app de compra |
| `idComprador` | Identificador del comprador |
| `idCarrito` | Referencia al carrito de compras |
| `fechaHora` | Fecha y hora de la orden |
| `estadoOrdenCompra` | Estado actual de la orden |
| `idShipping` | Cargado por Shipping App |
| `idPago` | Se genera al finalizar la orden de compra |

Una orden puede tener muchos paquetes; cada paquete pertenece a una sola orden.

#### Paquete

| Campo | Descripción |
|---|---|
| `idPaquete` | Identificador único del paquete |
| `idOrdenCompra` | FK → Orden de Compra |
| `idVendedor` | Identificador del vendedor |
| `monto` | Monto del paquete |
| `montoEnvio` | Monto del envío |
| `idComprador` | Identificador del comprador |
| `idShipping` | Cargado por Shipping App |

Un paquete puede contener diferentes artículos.

#### Artículos Paquete

| Campo | Descripción |
|---|---|
| `idArticulosPaquete` | Identificador único |
| `idPaquete` | FK → Paquete |
| `idArticulo` | Referencia al artículo |
| `precioUnitario` | Precio unitario al momento de la compra |
| `cantidad` | Cantidad de unidades |
| `subtotal` | Subtotal del ítem |

#### Artículo

| Campo | Descripción |
|---|---|
| `idArticulo` | Identificador único del artículo |
| `idVendedor` | Identificador del vendedor |
| `categoria` | Categoría/s del artículo |
| `descripcion` | Descripción del artículo |
| `stock` | Stock disponible |
| `imagen` | Imagen del artículo |

---

### Datos o Acciones que Requieren Comunicación con Otra App

#### Con Buyer App — _API: Buyer API_

| Acción | Dirección |
|---|---|
| Recibir carrito con datos del usuario (checkout) | ← Recibe de Buyer App |
| Confirmar orden finalizada al comprador | → Envía a Buyer App |
| Responder historial de órdenes al comprador | → Envía a Buyer App |
| Responder detalles de pago al comprador | → Envía a Buyer App |

#### Con Payments App — _API: Payments API_

| Acción | Dirección |
|---|---|
| Iniciar proceso de pago | → Envía a Payments App |
| Consultar estado o resultado del pago | → Envía a Payments App |

#### Con Shipping App — _API: Shipping API_

| Acción | Dirección |
|---|---|
| Solicitar creación de un envío (una vez confirmado el pago) | → Envía a Shipping App |
| Consultar estado del envío | → Envía a Shipping App |

### Shipping App
**Responsable:** Ludmila Prolygin

**Datos Propios (en qué base de datos vive cada entidad)**
- Envío: identificador del envío, orden asociada, dirección de entrega, costo, fecha de generación, estado actual.
- Estado de envío: pendiente, preparado, despachado, en tránsito, entregado, cancelado, con incidencia, etc.
- Historial de seguimiento: registro cronológico de cambios de estado, fechas y observaciones.
- Operador logístico: empresa o repartidor asignado al envío, datos de contacto, disponibilidad.
- Asignación logística: relación entre envío y operador logístico responsable.
- Incidencia de entrega: problemas ocurridos durante el proceso de envío, como demoras, dirección inválida, destinatario ausente o rechazo.
- Usuario: datos personales, contacto, rol.

**Datos o acciones que requieren comunicación con otra app (y a través de qué API)**  
- Con Buyer App
    - Recibe los datos necesarios para cotizar el envío antes de la compra, como dirección de destino y características del pedido.
    - Informa al comprador el estado actualizado del envío y el seguimiento de la entrega.
    - Consulta envíos del usuario.
    - APIs involucrada: Shipping API, Buyer API.
- Con Seller App
    - Recibe la confirmación de que un pedido está listo para despacho.
    - Informa al vendedor el estado logístico del envío y eventuales incidencias.
    - Consulta envíos del usuario.
    - APIs involucrada: Shipping API, Seller API.

### Payments App
<!-- Entidades que viven en la base de datos de esta app -->
**Datos Propios (en qué base de datos vive cada entidad)**
- PaymentOrder: Registra cada intento de cobro iniciado por la Buyer App. Almacena el monto, el estado del pago y la referencia al pago en Mercado Pago, y sirve como conexión entre la orden de compra y la confirmación del cobro.
<!-- - Dispute: Registra las disputas que inicia cada comprador. Almacena datos básicos para que puedan iniciar una conversación y el estado de la disputa. -->

**Datos o acciones que requieren comunicación con otra app (y a través de qué API)**
- Solicitud de cobro (seller_app_id, seller_app_order_id, buyer_app_id, buyer_id, amount) → recibo de Seller App
- Notificación de pago confirmado (id_payment_order, status) → envío a Seller App

---

## Datos o acciones que requieren comunicación entre apps

| App origen | Acción / dato necesario | App destino | API involucrada |
|------------|-------------------------|-------------|-----------------|
| Buyer App | Consulta de productos publicados, stock disponible y datos necesarios para mostrar catálogo y detalle de producto | Seller App | Seller API |
| Buyer App | Validación de productos del carrito al momento del checkout (precio, disponibilidad, stock) | Seller App | Seller API |
| Buyer App | Envío de datos del pedido para cotización previa del envío (dirección, volumen/peso, cantidad de paquetes u otros atributos logísticos) | Shipping App | Shipping API |
| Buyer App | Envío de carrito en estado **checked out** para generar orden logística / iniciar gestión de envío | Shipping App | Shipping API |
| Buyer App | Consulta de estado del envío y seguimiento de entrega | Shipping App | Shipping API |
| Buyer App | Consulta de historial de compra con información logística | Shipping App | Shipping API |
| Buyer App | Consulta de historial de compra con información de pago | Payments App | Payments API |
| Buyer App | Solicitud de detalle o estado de un pago asociado a una compra | Payments App | Payments API |
| Buyer App | Inicio o registro de disputa asociada a una compra | Payments App | Payments API |
| Buyer App | Consulta de estado de una disputa asociada a una compra | Payments App | Payments API |
| Buyer App | Confirmación de compra / checkout | Seller App | Seller API |
| Seller App | Solicitud de cobro de una compra (buyer_id, orden, monto, referencia de compra) | Payments App | Payments API |
| Seller App | Alta, modificación o baja de productos para disponibilidad en catálogo | Buyer App | Buyer API / Seller API |
| Seller App | Confirmación de que el pedido está preparado o listo para despacho | Shipping App | Shipping API |
| Seller App | Consulta de estado logístico del envío asociado a una venta | Shipping App | Shipping API |
| Shipping App | Notificación de estado actualizado del envío y eventos de seguimiento | Buyer App | Shipping API |
| Shipping App | Notificación al vendedor sobre estado logístico del pedido e incidencias | Seller App | Shipping API |
| Payments App | Notificación de pago confirmado, rechazado o pendiente | Seller App | Payments API |
