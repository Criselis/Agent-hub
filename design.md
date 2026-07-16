# Especificación de Diseño

# Estilo General

El panel debe inspirarse en dashboards modernos tipo:

- Vercel
- Supabase
- Stripe Dashboard
- Linear
- GitHub Admin

Debe utilizar una paleta sobria con colores de acento para estados.

---

# Layout

## Sidebar

Posición:

- Fija a la izquierda.

Contenido:

- Logo AgentHub.
- Menú de navegación.
- Iconos.
- Estado activo.

---

## Topbar

Incluye:

- Título de la sección actual.
- Toggle Light / Dark Mode.

---

## Área principal

Cada sección ocupa el contenido principal.

Se utilizará padding amplio y separación uniforme.

---

# Dark Mode

Debe implementarse mediante las utilidades `dark:` de Tailwind.

El cambio afecta a:

- Fondo
- Cards
- Sidebar
- Texto
- Tablas
- Botones
- Modales
- Dropdowns

---

# Sección 1 — Dashboard

Componentes:

## Tarjetas KPI

Mostrar:

- Ingresos del mes
- Descuentos aplicados
- Agentes activos
- Agentes fallando

Cada tarjeta contiene:

- Título
- Valor
- Icono

---

## Gráfico

Debajo de las tarjetas.

No requiere funcionalidad.

Solo un placeholder con texto:

"Weekly Activity Chart"

---

# Sección 2 — Gestión de usuarios

Tabla con columnas:

- Nombre
- Email
- Plan
- Estado
- Acciones

Cada fila contiene un menú desplegable (⋮).

Opciones:

- Ver detalle
- Eliminar

"Ver detalle" abre un modal.

El modal muestra:

- Nombre
- Email
- Empresa
- Plan
- Estado
- Fecha de registro

Se puede cerrar:

- Botón Close
- Click sobre backdrop

---

# Sección 3 — Gestión de agentes

Listado tipo cards.

Cada card muestra:

- Nombre
- Propietario
- Estado
- Skills

Las skills están colapsadas inicialmente.

Un botón expandible permite mostrarlas mediante una transición suave.

Cada agente posee un dropdown.

Opciones:

- Configurar
- Eliminar

Configurar abre un modal.

Contenido del modal:

System Prompt completo del agente.

---

# Sección 4 — Skills

Lista de todas las skills disponibles.

Cada skill contiene:

- Nombre
- Descripción
- Número de agentes utilizándola

Al inicio de la sección aparece un panel informativo explicando qué es una Skill.

Cada skill posee un menú desplegable.

Opciones:

- Ver detalle
- Eliminar

---

# Sección 5 — Contrataciones

Tabla con:

- Cliente
- Agente
- Skills
- Fechas
- Total

Cada fila incluye dropdown.

Ver detalle abre modal.

El modal contiene:

- Cliente
- Agente
- Duración
- Skills contratadas
- Precio individual de cada skill
- Total pagado

---

# Sección 6 — Log de errores

Tabla con:

- Timestamp
- Agente
- Tipo
- Descripción
- Acciones

Cada error muestra un Badge.

Ejemplos:

Critical → rojo

Warning → amarillo

Info → azul

Cada fila posee dropdown.

Opciones:

- Ver detalle
- Marcar como resuelto

El modal muestra:

- Stack Trace
- Mensaje
- Contexto
- Timestamp

---

# Componentes reutilizables

## Cards

Bordes redondeados.

Sombra ligera.

Padding uniforme.

---

## Botones

Primario

Secundario

Danger

Ghost

---

## Dropdown

Activación mediante botón ⋮

Cerrar automáticamente al seleccionar una opción o hacer click fuera.

---

## Modal

Overlay oscuro.

Animación fade.

Centrado.

Scroll interno si es necesario.

---

## Badges

Estados:

Activo

Inactivo

Fallando

Critical

Warning

Info

Plan Free

Plan Pro

Plan Enterprise

---

# Responsive

Desktop:

Sidebar visible.

Tablet:

Sidebar colapsable.

Mobile:

Sidebar tipo drawer.

Las tablas deben permitir scroll horizontal cuando sea necesario.

---

# Accesibilidad

Todos los botones tendrán:

- aria-label

Los modales:

- role="dialog"

Los dropdowns:

- navegación mediante teclado cuando sea posible.

Los contrastes deben cumplir accesibilidad básica.