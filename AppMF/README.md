# Sistema de Catálogo y Gestión de Solicitudes — ITCA-FEPADE

Aplicación móvil híbrida desarrollada con **Ionic + Angular** y conectada a una API RESTful en **Laravel + MySQL** para la consulta de catálogo tecnológico, generación de solicitudes y aprobación administrativa.

- **Estudiante:** Adiel Benjamín Benítez Bermúdez
- **Carnet:** 165625
- **Grupo:** TDS221-A
- **Carrera:** Técnico en Ingeniería en Desarrollo de Software — ITCA-FEPADE Santa Tecla

---

## Estructura del Proyecto

- `api-catalogo/`: Backend API REST desarrollada en Laravel (autenticación con tokens, control de acceso por rol, gestión de productos y solicitudes).
- `app-movil/`: Frontend móvil desarrollado en Ionic / Angular (standalone components, modo oscuro/claro, carrito persistente y panel de administración).

---

## Requisitos Previos

- **XAMPP** (Apache y MySQL activos)
- **PHP 8.2+** y **Composer**
- **Node.js 18+** y **Ionic CLI** (`npm install -g @ionic/cli`)

---

## Instalación y Ejecución Local

### 1. Configurar el Backend (`api-catalogo`)
1. Crear una base de datos en phpMyAdmin (por ejemplo: `db_catalogo`).
2. Entrar a la carpeta del backend e instalar dependencias:

```bash
cd api-catalogo
composer install
cp .env.example .env
php artisan key:generate