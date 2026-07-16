# AgentHub — Panel de Administración

## 1. Descripción del producto

### ¿Qué es AgentHub?

AgentHub es una plataforma SaaS que permite a empresas alquilar agentes de Inteligencia Artificial especializados para automatizar tareas de negocio. Cada agente puede incorporar diferentes **Skills** (habilidades) como navegación web, lectura de documentos, gestión de calendarios, automatización de procesos o conexión con servicios externos.

El objetivo del panel es proporcionar una interfaz de administración para supervisar toda la plataforma y servir como referencia para el futuro desarrollo del backend.

### Usuario administrador

El único usuario del prototipo es el **Administrador interno de AgentHub**, responsable de:

- Supervisar las métricas generales de la plataforma.
- Gestionar usuarios registrados.
- Administrar agentes IA.
- Consultar el catálogo de Skills.
- Revisar contratos de alquiler.
- Monitorizar errores de ejecución.
- Acceder rápidamente a información mediante modales y menús de acciones.

---

# 2. Stack tecnológico

El prototipo deberá desarrollarse exclusivamente utilizando:

- HTML5
- TailwindCSS cargado mediante CDN
- JavaScript Vanilla (ES6)

No está permitido utilizar:

- React
- Vue
- Angular
- Bootstrap
- jQuery
- Node.js
- Backend
- APIs
- Base de datos

Todos los datos deberán estar completamente hardcodeados.

---

# 3. Restricciones del proyecto

- El proyecto será completamente frontend.
- No existirá autenticación.
- No habrá persistencia de datos.
- Todas las acciones serán simuladas mediante JavaScript.
- La interfaz deberá ser completamente responsive.
- El modo oscuro utilizará exclusivamente las utilidades `dark:` de Tailwind.
- No se utilizarán librerías externas para modales, dropdowns o animaciones.

---

# 4. Especificaciones por sección

## Dashboard

### Especificación 1

El Dashboard mostrará **cinco tarjetas de métricas** distribuidas en una cuadrícula responsive (3 columnas en escritorio, 2 en tablet y 1 en móvil). Cada tarjeta incluirá:

- Icono
- Título
- Valor hardcodeado
- Pequeña variación porcentual respecto al mes anterior

### Especificación 2

Debajo de las métricas se mostrará un panel grande simulando un gráfico semanal ("Weekly Activity Overview"), con un diseño elegante mediante líneas y barras decorativas creadas únicamente con HTML y Tailwind.

### Especificación 3

El Dashboard utilizará un diseño profesional inspirado en productos SaaS modernos (Stripe, Supabase, Vercel o Linear), con tarjetas elevadas, sombras suaves, esquinas redondeadas y espaciado amplio.

### Especificación 4

Las tarjetas deberán cambiar correctamente entre modo claro y oscuro sin perder contraste.

---

## Gestión de usuarios

### Especificación 1

La vista mostrará una tabla responsive con las columnas:

- Nombre
- Email
- Plan
- Estado
- Acciones

### Especificación 2

Cada fila tendrá un botón ⋮ que abrirá un dropdown con las opciones:

- Ver detalle
- Eliminar

Solo un dropdown podrá permanecer abierto simultáneamente.

### Especificación 3

Seleccionar "Ver detalle" abrirá un modal mostrando:

- Nombre completo
- Email
- Empresa
- Plan contratado
- Estado
- Fecha de registro

El modal podrá cerrarse mediante el botón de cierre o haciendo clic sobre el backdrop.

### Especificación 4

El estado del usuario utilizará badges de colores diferenciados.

---

## Gestión de agentes

### Especificación 1

Los agentes se mostrarán mediante tarjetas organizadas en una cuadrícula responsive.

Cada tarjeta incluirá:

- Nombre del agente
- Propietario
- Estado
- Número de Skills

### Especificación 2

Las Skills aparecerán inicialmente ocultas.

Un botón expandible permitirá desplegarlas mediante una transición suave.

### Especificación 3

Cada tarjeta incluirá un menú de acciones con:

- Configurar
- Eliminar

### Especificación 4

Seleccionar "Configurar" abrirá un modal mostrando el System Prompt completo del agente en un bloque de código.

---

## Skills

### Especificación 1

La parte superior incluirá una tarjeta informativa explicando qué representa una Skill dentro de AgentHub.

### Especificación 2

Cada Skill mostrará:

- Nombre
- Descripción
- Número de agentes que la utilizan

### Especificación 3

Cada Skill dispondrá de un dropdown de acciones con:

- Ver detalle
- Eliminar

### Especificación 4

Las Skills se mostrarán mediante tarjetas homogéneas con iconografía representativa.

---

## Contrataciones

### Especificación 1

Se mostrará una tabla con:

- Cliente
- Agente contratado
- Skills
- Fechas
- Total pagado

### Especificación 2

Cada fila dispondrá de un dropdown de acciones.

### Especificación 3

La opción "Ver detalle" abrirá un modal mostrando:

- Cliente
- Agente
- Duración
- Skills contratadas
- Precio individual de cada Skill
- Total abonado

### Especificación 4

Las fechas del contrato aparecerán claramente diferenciadas mediante tipografía secundaria.

---

## Log de errores

### Especificación 1

Se mostrará una tabla con:

- Timestamp
- Agente
- Tipo
- Descripción
- Acciones

### Especificación 2

Cada error utilizará un badge visual según su gravedad:

- Critical
- Warning
- Info

### Especificación 3

Cada fila tendrá un menú de acciones con:

- Ver detalle
- Marcar como resuelto

### Especificación 4

El modal de detalle mostrará:

- Stack Trace
- Mensaje completo
- Contexto
- Fecha
- Agente asociado

---

# 5. Inventario de componentes

Los siguientes componentes deberán reutilizarse en distintas secciones del proyecto:

## Sidebar

- Navegación persistente.
- Iconos.
- Estado activo.
- Responsive.

## Topbar

- Título dinámico.
- Toggle Light / Dark.

## Tarjeta de métrica

- Icono.
- Título.
- Valor.
- Indicador porcentual.

## Dropdown de acciones

- Botón ⋮
- Apertura y cierre mediante JavaScript.
- Cierre automático al hacer clic fuera.

## Modal

- Overlay oscuro.
- Animación de apertura.
- Cierre mediante botón.
- Cierre haciendo clic sobre el fondo.

## Badge

Utilizado para:

- Estados
- Planes
- Errores
- Agentes

## Lista de Skills colapsable

- Expandible.
- Animación suave.
- Reutilizada en Gestión de Agentes.

## Toggle modo claro / oscuro

- Cambia toda la interfaz.
- Implementado mediante la clase `dark`.

## Botones reutilizables

- Primario
- Secundario
- Danger
- Ghost

## Cards

Utilizadas en:

- Dashboard
- Skills
- Agentes

---

# 6. Criterios de aceptación

1. La navegación lateral permanece visible durante toda la navegación.
2. El modo oscuro cambia correctamente todos los componentes mediante `dark:`.
3. Todas las tablas son responsive.
4. Todas las tarjetas mantienen una apariencia consistente.
5. Todos los dropdowns funcionan correctamente.
6. Solo un dropdown puede permanecer abierto al mismo tiempo.
7. Todos los modales pueden abrirse desde sus respectivas acciones.
8. Todos los modales pueden cerrarse mediante botón.
9. Todos los modales pueden cerrarse haciendo clic sobre el backdrop.
10. Las Skills de cada agente pueden expandirse y colapsarse con una transición.
11. Todos los badges utilizan colores consistentes según el estado.
12. Todos los datos mostrados son hardcodeados.
13. El Dashboard presenta un diseño moderno, elegante y profesional con cinco métricas y un gráfico de actividad simulado.
14. No existe ninguna llamada a APIs ni dependencias de backend.
15. Todo el proyecto está desarrollado únicamente con HTML, TailwindCSS vía CDN y JavaScript Vanilla.
16. La interfaz es completamente responsive en escritorio, tablet y móvil.
17. Todos los componentes mantienen una apariencia consistente en modo claro y oscuro.
18. El prototipo puede utilizarse como referencia visual y funcional para el desarrollo del backend sin requerir aclaraciones adicionales.