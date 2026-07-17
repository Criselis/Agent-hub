Actúa como un desarrollador Frontend Senior especializado en HTML, TailwindCSS y JavaScript Vanilla.

Tu objetivo es construir un prototipo completo del panel de administración de AgentHub.

Antes de escribir el código, sigue estrictamente estas especificaciones.

# Tecnologías

Utiliza únicamente:

- HTML5
- TailwindCSS vía CDN
- JavaScript Vanilla (ES6)

No utilices:

- React
- Vue
- Angular
- Bootstrap
- jQuery
- Node
- Backend
- APIs
- Base de datos
- CSS personalizado
- atributos style=""
- Frameworks adicionales

Todos los estilos deben implementarse exclusivamente mediante clases de Tailwind.

Todos los datos deben estar hardcodeados.

--------------------------------------------

# Diseño

El diseño debe sentirse moderno, elegante y profesional.

Inspiración:

- Material Dashboard
- Stripe Dashboard
- Linear
- Supabase
- Vercel

La interfaz debe utilizar:

- Sidebar fija
- Cards elevadas
- Sombras suaves
- Bordes redondeados
- Espaciado generoso
- Iconografía consistente
- Colores vibrantes para destacar métricas
- Fondo gris muy claro
- Cards blancas
- Excelente jerarquía visual

Debe ser completamente responsive.

--------------------------------------------

# Layout

Crear una barra lateral persistente con navegación para las siguientes secciones:

- Dashboard
- Gestión de usuarios
- Gestión de agentes
- Skills
- Contrataciones
- Log de errores

La sección activa debe resaltarse visualmente.

Agregar una barra superior con:

- Nombre de la sección
- Buscador
- Toggle Light/Dark
- Avatar del administrador

--------------------------------------------

# Dashboard

Crear cuatro tarjetas de métricas mostrando:

- Ingresos totales del mes
- Pérdidas por descuentos
- Agentes activos
- Agentes fallando

Cada tarjeta debe contener:

- Icono
- Nombre
- Valor hardcodeado

Debajo colocar un área de ancho completo que represente un gráfico de actividad semanal.

No utilizar librerías de gráficos.

Debe ser únicamente un placeholder elegante construido con HTML y Tailwind.

--------------------------------------------

# Gestión de usuarios

Crear una tabla con al menos cinco usuarios hardcodeados.

Columnas:

- Nombre
- Email
- Plan
- Estado
- Acciones

Cada fila tendrá un botón ⋮.

Al abrirlo mostrará:

- Ver detalle
- Eliminar

Al pulsar "Ver detalle"

Abrir un modal mostrando:

- Nombre
- Email
- Empresa
- Plan
- Estado
- Fecha de registro

El modal debe cerrarse mediante:

- Botón cerrar
- Click sobre el backdrop

--------------------------------------------

# Gestión de agentes

Mostrar un listado de al menos cuatro agentes.

Cada agente mostrará:

- Nombre
- Propietario
- Estado
- Lista de skills colapsada

Las skills estarán ocultas inicialmente.

Al pulsar el botón expandible se mostrarán mediante una transición suave.

Cada agente tendrá un menú ⋮ con:

- Configurar
- Eliminar

Al seleccionar "Configurar"

Abrir un modal mostrando el System Prompt completo del agente dentro de un textarea editable.

--------------------------------------------

# Skills

Crear un catálogo con al menos cuatro skills.

Cada skill mostrará:

- Nombre
- Descripción
- Número de agentes utilizándola

Al inicio de la sección incluir una tarjeta informativa explicando qué significa una Skill dentro de AgentHub.

Cada Skill tendrá un menú ⋮ con:

- Ver detalle
- Eliminar

--------------------------------------------

# Contrataciones

Crear una tabla con al menos cuatro contratos.

Mostrar:

- Cliente
- Agente
- Skills contratadas
- Fecha inicio
- Fecha fin
- Importe pagado

Cada fila tendrá un botón ⋮.

La opción "Ver detalle"

Abrirá un modal mostrando:

- Cliente
- Agente
- Duración
- Skills contratadas
- Precio individual de cada skill
- Total pagado

--------------------------------------------

# Log de errores

Crear una tabla con al menos seis errores hardcodeados.

Columnas:

- Timestamp
- Agente
- Tipo
- Descripción
- Acciones

Los tipos deberán utilizar badges de colores:

Rojo

Critical

Amarillo

Warning

Azul

Info

Cada fila tendrá un botón ⋮ con:

- Ver detalle
- Marcar como resuelto

"Ver detalle"

Abrirá un modal mostrando:

- Stack Trace completo
- Mensaje
- Contexto
- Timestamp

--------------------------------------------

# Interacciones globales

Implementar un Toggle Dark / Light Mode utilizando exclusivamente las utilidades dark: de Tailwind.

El modo seleccionado deberá mantenerse al navegar entre las distintas secciones.

Todos los dropdowns deberán cerrarse automáticamente al hacer clic fuera de ellos.

Todos los modales deberán cerrarse:

- Pulsando el botón cerrar.
- Haciendo clic sobre el backdrop.

--------------------------------------------

# Componentes reutilizables

Crear componentes reutilizables para:

- Sidebar
- Topbar
- Tarjetas KPI
- Cards
- Dropdowns
- Modales
- Badges
- Botones
- Lista de Skills colapsable
- Toggle Dark Mode

--------------------------------------------

# Responsive

Desktop

Sidebar fija.

Tablet

Sidebar colapsable.

Mobile

Sidebar tipo Drawer.

Las tablas deberán permitir scroll horizontal.

Las cards deberán reorganizarse automáticamente.

--------------------------------------------

# Accesibilidad

Agregar:

- aria-label a botones
- role="dialog" en modales
- Buen contraste
- Navegación básica mediante teclado

--------------------------------------------

# Restricciones

No utilizar datos dinámicos.

No utilizar APIs.

No utilizar Backend.

No utilizar librerías externas para modales o dropdowns.

Todo debe implementarse únicamente con HTML, TailwindCSS vía CDN y JavaScript Vanilla.

--------------------------------------------

# Resultado esperado

Generar un único archivo index.html completamente funcional que incluya:

- Toda la estructura HTML
- Tailwind vía CDN
- JavaScript Vanilla embebido
- Todas las interacciones funcionando
- Un diseño moderno y elegante inspirado en dashboards SaaS profesionales, listo para servir como referencia para el futuro desarrollo del backend.

Este prompt incorpora todos los requisitos funcionales de la rúbrica de 4Geeks (sidebar, dashboard,