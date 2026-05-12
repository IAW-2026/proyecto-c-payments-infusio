[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Ks7Ywtwc)
# Infusio Payments

Aplicación **Payments** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `<!-- completar -->`.

Esta app corresponde al módulo de pagos en los proyectos de tipo **C (Marketplace)**, diseñado específicamente para la red de **Infusio** (venta de té, café y accesorios de especialidad).

---

## Características Principales
- **Autenticación (Clerk):** Perfiles seguros para Administradores, Compradores y Vendedores.
- **Integración Mercado Pago:** Checkout Pro en modo Sandbox con recepción de Webhooks.
- **Dashboards Personalizados:** Vistas de métricas, gráficos y listados de transacciones dependiendo del rol.
- **Base de Datos (Prisma + PostgreSQL):** Registro inmutable de transacciones y estados (`pending`, `accepted`, `cancelled`).
- **Exportación CSV:** Reportes descargables desde el panel de Administración.

---

## Guía de Instalación Local

Para correr este proyecto y evaluarlo localmente, sigue estos pasos:

### 1. Clonar e Instalar
\`\`\`bash
git clone https://github.com/IAW-2026/proyecto-c-payments-infusio.git
cd proyecto-c-payments-infusio
npm install
\`\`\`

### 2. Variables de Entorno
Copia el archivo de ejemplo para crear tus variables locales:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Asegúrate de configurar las siguientes variables en `.env.local`:
- \`DATABASE_URL\`: Conexión a tu base de datos PostgreSQL local o remota.
- \`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY\` y \`CLERK_SECRET_KEY\`: Tus credenciales de Clerk.
- \`MP_ACCESS_TOKEN\`: Tu Access Token de prueba de Mercado Pago.
- \`NEXT_PUBLIC_APP_URL\`: La URL donde corre la app (ej: \`http://localhost:3000\`).

### 3. Base de Datos
Sincroniza el esquema de Prisma con la base de datos:
\`\`\`bash
npx prisma db push
\`\`\`

### 4. Levantar el Servidor
\`\`\`bash
npm run dev
\`\`\`
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Pruebas de Pagos (Mercado Pago Sandbox)
Para probar el flujo de pagos completo, debes utilizar las **tarjetas de prueba** provistas por Mercado Pago. 

Al hacer clic en "Aprobar Pago" (o simular un pago), serás redirigido de vuelta a la aplicación donde verás una confirmación visual y el cambio de estado en el panel de control.

---
Enunciado completo: <https://iaw-2026.github.io/proyecto/>
