# Contexto del Proyecto

## Nombre
AgentHub - Plataforma de Alquiler de Agentes IA

## Objetivo

Desarrollar un prototipo frontend (HTML + TailwindCSS + JavaScript) de un panel de administración para una plataforma SaaS que permite alquilar agentes de Inteligencia Artificial a empresas.

El objetivo del prototipo es servir como referencia visual y funcional para el futuro desarrollo del backend, por lo que todos los datos serán estáticos (hardcodeados).

No se requiere conexión con APIs, autenticación ni persistencia de datos.

---

# Contexto del negocio

AgentHub permite que empresas alquilen agentes de IA especializados para diferentes tareas empresariales.

Cada agente puede tener una o varias Skills, que representan capacidades adicionales como:

- Navegar por Internet
- Leer documentos PDF
- Gestionar calendarios
- Responder emails
- Consultar bases de datos
- Integrarse con CRMs
- Ejecutar automatizaciones

Las empresas pagan por alquilar agentes durante un período determinado y seleccionan las skills que necesitan.

El panel de administración está destinado al equipo interno de AgentHub para supervisar la plataforma.

---

# Usuarios del sistema

Administrador interno de AgentHub.

Necesita:

- Consultar métricas generales.
- Gestionar usuarios.
- Gestionar agentes.
- Consultar catálogo de skills.
- Revisar contrataciones.
- Revisar errores de ejecución.
- Acceder rápidamente a información mediante modales.
- Ejecutar acciones administrativas simuladas.

---

# Alcance del prototipo

El proyecto consiste únicamente en el frontend.

Incluye:

- HTML
- TailwindCSS
- JavaScript Vanilla

No incluye:

- Backend
- Base de datos
- Login
- APIs
- Frameworks JS
- Persistencia

---

# Objetivos UX

El panel debe transmitir:

- Profesionalismo
- Limpieza visual
- Organización
- Escalabilidad
- Fácil navegación
- Aspecto SaaS moderno

Debe ser completamente responsive.

---

# Navegación

El panel posee una navegación lateral persistente.

Secciones:

1. Dashboard
2. Gestión de usuarios
3. Gestión de agentes
4. Skills
5. Contrataciones
6. Log de errores

La barra superior contiene:

- Título de la página
- Toggle Light/Dark Mode

---

# Datos

Todos los datos estarán hardcodeados.

No existe comunicación con ningún servidor.

Todas las acciones serán simuladas.

---

# Tecnologías

- HTML5
- TailwindCSS
- JavaScript ES6

---

# Principios de desarrollo

- Componentes reutilizables.
- Código organizado.
- Fácil mantenimiento.
- Diseño consistente.
- Accesibilidad básica.
- Preparado para futura integración con backend.