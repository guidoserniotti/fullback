# Fullback - Phonebook API

Una API REST para gestionar una agenda telefónica, desarrollada con Node.js y Express.js como parte del curso Full Stack Open.

## Despliegue

La aplicación está desplegada en: **[fullback.fly.dev](https://fullback.fly.dev)**

## Descripción

Fullback es una API que permite gestionar contactos de una agenda telefónica. Proporciona endpoints para crear, leer, actualizar y eliminar personas con sus números de teléfono.

## Características

-   API REST completa para gestión de contactos
-   Middleware de logging con Morgan
-   Validación de datos de entrada
-   Manejo de errores personalizado
-   CORS habilitado para frontend
-   Servir archivos estáticos (frontend integrado)
-   Despliegue en producción con Fly.io

## Tecnologías

-   **Node.js** - Runtime de JavaScript
-   **Express.js** - Framework web minimalista
-   **Morgan** - Middleware de logging HTTP
-   **CORS** - Middleware para habilitar CORS
-   **Fly.io** - Plataforma de despliegue

## API Endpoints

### Información general

-   `GET /` - Página de inicio
-   `GET /info` - Información sobre la cantidad de contactos

### Gestión de personas

-   `GET /api/persons` - Obtener todos los contactos
-   `GET /api/persons/:id` - Obtener un contacto específico
-   `POST /api/persons` - Crear un nuevo contacto
-   `DELETE /api/persons/:id` - Eliminar un contacto

### Ejemplo de uso

#### Obtener todos los contactos

```http
GET https://fullback.fly.dev/api/persons
```

#### Crear un nuevo contacto

```http
POST https://fullback.fly.dev/api/persons
Content-Type: application/json

{
    "name": "Juan Pérez",
    "number": "123-456-7890"
}
```

#### Eliminar un contacto

```http
DELETE https://fullback.fly.dev/api/persons/1
```

## Instalación y uso local

### Prerrequisitos

-   Node.js (v14 o superior)
-   npm

### Pasos para ejecutar localmente

1. **Clonar el repositorio**

    ```bash
    git clone https://github.com/guidoserniotti/fullback.git
    cd fullback
    ```

2. **Instalar dependencias**

    ```bash
    npm install
    ```

3. **Ejecutar en modo desarrollo**

    ```bash
    npm run dev
    ```

4. **Ejecutar en modo producción**
    ```bash
    npm start
    ```

La aplicación estará disponible en `http://localhost:3001`

## Scripts disponibles

-   `npm start` - Ejecutar la aplicación en producción
-   `npm run dev` - Ejecutar en modo desarrollo con nodemon
-   `npm run build:ui` - Construir el frontend y copiarlo al backend
-   `npm run deploy` - Desplegar a Fly.io
-   `npm run deploy:full` - Construir UI y desplegar
-   `npm run logs:prod` - Ver logs de producción

## Estructura del proyecto

```
fullback/
├── index.js              # Archivo principal del servidor
├── package.json          # Dependencias y scripts
├── prueba_persona.rest   # Archivo de pruebas REST
├── dist/                 # Frontend construido (si existe)
└── README.md            # Este archivo
```

## Testing

Puedes probar la API usando el archivo `prueba_persona.rest` con la extensión REST Client de VS Code, o usar herramientas como:

-   Postman
-   Thunder Client
-   curl

## Despliegue

La aplicación está configurada para desplegarse en Fly.io. El proceso incluye:

1. Construcción automática del frontend
2. Copia de archivos estáticos
3. Despliegue con configuración de producción

## Validaciones

-   **Nombre**: Requerido y único
-   **Número**: Requerido
-   **ID**: Generado automáticamente

## 👨‍💻 Autores

**Guido Serniotti** - [guidoserniotti](https://github.com/guidoserniotti)
**Alvaro Ibarra** - [ibarra1812](https://github.com/ibarra1812)

---

Desarrollado como parte del curso [Full Stack Open](https://fullstackopen.com/) de la Universidad de Helsinki.
