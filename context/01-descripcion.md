# 1.1 — Descripción del Sistema

> **Tipo C — Marketplace**

## ¿Qué problema resuelve?

El sistema resuelve la necesidad de gestionar de manera integral el proceso de compra-venta de productos relacionados con infusiones (bebidas y accesorios).
Para ello, se estructura en cuatro aplicaciones internas especializadas —buyer, seller, payment y shipping— que, en conjunto, permiten cubrir todo el ciclo de operación: desde la interacción del comprador y la publicación de productos por parte del vendedor, hasta el procesamiento de pagos y la gestión logística de envíos.

## Actores del sistema

| Actor                          | Descripción                                                                 | Apps donde interactúa                 |
|--------------------------------|-----------------------------------------------------------------------------|--------------------------------------|
| Comprador                      | Usuario final que navega el catálogo, selecciona productos y realiza compras. | Buyer App, Payments App, Shipping App |
| Vendedor                       | Usuario encargado de publicar, gestionar y actualizar los productos.         | Seller App, Shipping App              |
| Comprador (pagador)            | Inicia el pago seleccionando un medio de pago.                               | Payments App                          |
| Pasarela de pago               | Servicio externo que procesa, valida y autoriza/rechaza pagos.               | Payments App                          |
| Sistema interno de pagos       | Registra transacciones y gestiona estados (pendiente, aprobado, rechazado).  | Payments App                          |
| Vendedor (origen)              | Prepara el pedido y lo pone a disposición para despacho.                     | Seller App, Shipping App              |
| Operador logístico             | Retira, transporta y entrega el producto.                                    | Shipping App                          |
| Comprador (destinatario)       | Recibe el producto en la ubicación indicada.                                 | Shipping App                          |
| Sistema interno de envíos      | Gestiona órdenes de envío, tracking y estados de entrega.                    | Shipping App                          |
| Administrador                  | Supervisa y gestiona el funcionamiento general del sistema.                  | Todas las Apps                        |

- Comprador (Buyer): Usuario final que navega el catálogo, selecciona productos y realiza compras.
- Vendedor (Seller): Usuario encargado de publicar, gestionar y actualizar los productos disponibles en la plataforma.
- Sistema de Pagos (Payment): Módulo responsable de procesar, validar y registrar las transacciones económicas.
    - Comprador (pagador): Inicia el pago seleccionando un medio (tarjeta, transferencia, billetera digital, etc.).
    - Pasarela de pago: Servicio externo que procesa la transacción, valida los datos y autoriza o rechaza el pago.
    - Sistema interno de pagos: Registra las transacciones, gestiona estados (pendiente, aprobado, rechazado) y asegura la trazabilidad.
- Sistema de Envíos (Shipping): Módulo encargado de gestionar la logística de entrega de los productos.
    - Vendedor (origen): Prepara el pedido y lo pone a disposición para su despacho.
    - Operador logístico / transportista: Servicio encargado de retirar, transportar y entregar el producto. Puede ser un proveedor externo o una flota propia.
    - Comprador (destinatario): Recibe el producto en la ubicación indicada.
- Sistema interno de envíos: Coordina la generación de órdenes de envío, seguimiento (tracking), estados de entrega y gestión de incidencias.
-Administrador: Usuario con permisos para supervisar y gestionar el funcionamiento general del sistema.

## Flujo principal de uso

1. El comprador navega el catálogo, selecciona productos e inicia el proceso de compra desde la **Buyer App**.
2. El sistema solicita el cálculo del costo de envío a la **Shipping App**, que lo obtiene mediante una API en función del destino y características del pedido.
3. El comprador visualiza el resumen de la orden (productos, envío y total) y confirma la compra desde la **Buyer App**.
4. El pago se procesa a través de la **Payments App**, que interactúa con la pasarela de pago correspondiente.
5. Una vez aprobado el pago, se genera la orden y el vendedor la gestiona desde la **Seller App**.
6. El vendedor prepara el pedido y coordina el despacho desde la **Seller App**.
7. El operador logístico gestiona el envío, realiza el seguimiento y actualiza el estado desde la **Shipping App**.
8. El producto es entregado al comprador y la transacción se completa.
