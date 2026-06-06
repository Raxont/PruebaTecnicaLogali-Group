# FormaPro Academy - Dashboard de Pagos

Panel de administración interactivo y reactivo para visualizar la analítica de pagos, KPIs globales y distribución de ingresos por curso en tiempo real.

**Stack Tecnológico:** Next.js (App Router), React, Supabase, TailwindCSS, Recharts.

## 📌 Estado del Proyecto

Proyecto desarrollado como solución a la prueba técnica. Incluye una arquitectura desacoplada con rutas API server-side que interactúan de forma segura con Supabase, lógica multimoneda y un sistema de alertas de negocio dinámicas.

## 🛠️ Requisitos Previos

- Node.js 18 o superior
- npm, yarn o pnpm
- Instancia de Supabase configurada (tablas de pagos)

## 🚀 Instalación y Clonación

```bash
git clone https://github.com/Raxont/PruebaTecnicaLogali-Group
cd PruebaTecnicaLogali-Group

# Instalar dependencias
npm install
```

## ⚙️ Configuración y Variables de Entorno

Crear un archivo .env.local en la raíz del proyecto. Este archivo está protegido por .gitignore y no debe subirse al repositorio de control de versiones.

```bash
# URL pública de tu proyecto en Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Clave de rol de servicio (¡MANTENER ESTRICTAMENTE EN SERVIDOR!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

> ⚠️ **¡ATENCIÓN DE SEGURIDAD!**
>
> La clave SUPABASE_SERVICE_ROLE_KEY otorga bypass a las políticas de seguridad (RLS). Su uso está restringido exclusivamente al entorno del servidor (API Routes). Nunca debe ser expuesta en componentes del cliente ni subirse a repositorios públicos.

## 💻 Scripts Disponibles

- npm run dev — Inicia el servidor de desarrollo local en http://localhost:3000.
- npm run build — Compila y optimiza la aplicación para producción.
- npm run start — Arranca la aplicación compilada en modo producción.
- npm run lint — Ejecuta las validaciones del Linter de Next.js.

## 📂 Estructura Relevante del Proyecto

- 📁 lib/formatters.ts — Utilidades centralizadas y blindadas de formateo dinámico (monedas COP/USD/EUR con API nativa y fechas).
- 📁 lib/supabase.ts — Configuración del cliente seguro de Supabase y lógica de agregación de KPIs.
- 📁 types/pago.ts — Tipados e interfaces estrictas de TypeScript para transacciones y métricas.
- 📁 app/api/pagos/route.ts — Endpoint seguro para operaciones de inserción y actualización de estados (completed / refunded).
- 📁 app/api/dashboard/route.ts — Endpoint unificado que procesa y retorna el payload consolidado del Dashboard.
- 📁 components/ui/ — Módulos de interfaz interactivos (Tarjetas de KPIs, tabla de transacciones, lista de alertas y el modal simulador).
- 📁 components/charts/ChartIngresos.tsx — Gráfico de barras interactivo con Recharts para la distribución de ingresos por curso.

## 📝 Decisiones de Diseño y Documentación

Para garantizar la máxima mantenibilidad del código, se implementó la convención Better Comments para la documentación interna, permitiendo una categorización visual clara:

- // ! — Alertas Críticas o Seguridad: Lógica sensible como el mecanismo de caída segura a COP ante anomalías de strings, o validaciones en el servidor.
- // ? — Arquitectura y Diseño: Justificaciones técnicas, como la centralización en el locale es-CO para consistencia visual del administrador.
- // * — Explicaciones Informativas: Flujos paso a paso del código.
- // TODO: — Escalabilidad Futura: Puntos de mejora previstos para cuando el negocio crezca (ej: logs de carritos abandonados).

## 🧪 Desarrollo y Pruebas en Vivo

1. Asegúrate de tener configuradas las variables en .env.local.
2. Ejecuta npm run dev y abre http://localhost:3000.
3. Simulador de Compras Integrado: Para probar la reactividad del sistema en tiempo real sin depender de Webhooks externos en la demo, utiliza el botón "✨ Simular Compra" en la esquina superior derecha. Podrás registrar montos altos para disparar alertas de seguridad o usar la acción de reembolso directo en la tabla para evaluar el recálculo dinámico de los KPIs.