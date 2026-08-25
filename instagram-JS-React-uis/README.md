# Instagram — API, Web y Mobile

Este proyecto corresponde al **trabajo práctico de la materia Desarrollo de Aplicaciones (UNQ, 1S2026)**, y consiste en una réplica funcional de **Instagram** implementada en tres capas independientes: una **API REST**, un **cliente web** y una **aplicación móvil**.

El objetivo fue construir un backend sobre el modelo de dominio provisto por la cátedra y luego consumirlo desde dos frontends con tecnologías distintas, resolviendo en cada uno los problemas propios de su plataforma: ruteo, manejo de sesión, almacenamiento del token y diseño de la interfaz.

- **Enunciado:** https://github.com/unq-ui/material/tree/master/TPs/2026s1
- **Modelo de dominio:** https://github.com/unq-ui/instagram-model-js

## 🧩 Componentes del Proyecto

### `Api/` — Backend REST

API en **Node.js + Express 5**, con autenticación por **JWT** y arquitectura en capas (rutas → controladores → servicios).

- Estado en memoria, provisto por `@unq-ui/instagram-model-js`, inyectado en cada request vía middleware.
- Middleware de autenticación que valida el token y middleware centralizado de manejo de errores.
- Capa de DTOs para no exponer la estructura interna del modelo hacia los clientes.
- CORS configurado para permitir el consumo desde el cliente web y desde Expo.

**Endpoints:**

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/register` | — | Registro de usuario |
| `POST` | `/login` | — | Login, devuelve el JWT |
| `GET` | `/user` | ✅ | Timeline del usuario logueado |
| `GET` | `/user/:userId` | — | Perfil público de un usuario |
| `PUT` | `/users/:userId/follow` | ✅ | Seguir / dejar de seguir |
| `GET` | `/search` | — | Búsqueda de usuarios y publicaciones |
| `POST` | `/posts` | ✅ | Crear publicación |
| `GET` | `/posts/:postId` | — | Detalle de una publicación |
| `PUT` | `/posts/:postId` | ✅ | Editar publicación |
| `DELETE` | `/posts/:postId` | ✅ | Eliminar publicación |
| `PUT` | `/posts/:postId/like` | ✅ | Dar / quitar like |
| `POST` | `/posts/:postId/comment` | ✅ | Comentar |

### `Web/` — Cliente Web

SPA en **React 19 + Vite**, con **React Router** para el ruteo y **axios** para el consumo de la API.

- Rutas protegidas: el acceso a las vistas privadas depende de la validez del token.
- Componentes reutilizables organizados por dominio (`posts/`, `comments/`, `profile/`, `search/`, `auth/`) con barrels de exportación.
- Estilos con CSS plano por componente, sin framework de UI.
- Notificaciones con `react-toastify`.
- Calidad de código con **ESLint + Prettier**, y hook de pre-commit con **Husky + lint-staged**.

### `Mobile/` — Aplicación Móvil

App en **React Native + Expo (SDK 54)**, escrita en **TypeScript**.

- Navegación basada en archivos con **expo-router**, incluyendo rutas dinámicas (`post/[id]`, `user/[id]`, `edit-post/[id]`) y grupos de layout para las tabs.
- Sesión persistida de forma segura con **expo-secure-store**.
- Selección de imágenes con **expo-image-picker**.
- Soporte de **tema claro y oscuro** mediante un sistema de colores centralizado y componentes tematizados.
- Custom hooks para encapsular la lógica de feed, interacción con posts y selección de imágenes.

## ✨ Funcionalidades

- Registro, login y persistencia de sesión.
- Timeline con las publicaciones de los usuarios seguidos.
- Creación, edición y eliminación de publicaciones.
- Likes y comentarios.
- Búsqueda de usuarios y publicaciones.
- Perfiles de usuario con estadísticas y grilla de posts.
- Seguir y dejar de seguir usuarios.

## 🔧 Ejecución del Proyecto

Cada subproyecto se levanta por separado. **La API debe estar corriendo antes que cualquiera de los dos clientes.** En los tres casos hay que copiar el `.env.example` a `.env` y completar los valores.

### API
```bash
cd Api
npm install
cp .env.example .env    # completar JWT_SECRET
npm run dev             # http://localhost:7070
```

### Web
```bash
cd Web
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:7070
npm run dev             # http://localhost:5173
```

### Mobile
```bash
cd Mobile
npm install
cp .env.example .env    # EXPO_PUBLIC_API_URL=http://<IP_DE_TU_MAQUINA>:7070
npm start
```

> ⚠️ En Mobile, `EXPO_PUBLIC_API_URL` **no puede apuntar a `localhost`** si se prueba en un dispositivo físico: hay que usar la IP de la máquina en la red local. Esa misma IP debe estar contemplada en la configuración de CORS de la API (`Api/src/app.js`).

## 📝 Notas

- El estado de la API es **en memoria**: al reiniciar el servidor se pierden los datos y se vuelve al dataset inicial del modelo.
- **Cambio respecto del enunciado:** el endpoint de timeline incluye las publicaciones del propio usuario logueado sin necesidad de que se siga a sí mismo. Esto se resuelve en el backend uniendo su timeline con sus propios posts.


## 👥 Colaboradores
Este proyecto fue desarrollado como un trabajo grupal. Gracias a mis compañeros por su dedicación:
* **Salvanescki, Nicolás Leonel** - [GitHub Profile](https://github.com/salvanescki)
* **Dores, Joaquín** - [GitHub Profile](https://github.com/joacodores)
* **Carnevale, Facundo** - [GitHub Profile](https://github.com/Jhanno3)
