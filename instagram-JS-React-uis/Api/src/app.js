import 'dotenv/config';
import express from 'express';
import getInstagramSystem from '@unq-ui/instagram-model-js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import postsRoutes from './routes/posts.routes.js';
import searchRoutes from './routes/search.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import cors from 'cors';

const app = express();
const authHeader = process.env.AUTH_HEADER || 'Authorization';
const exposedHeaders =
  authHeader === 'Authorization'
    ? ['Authorization']
    : ['Authorization', authHeader];
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8081', 'http://192.168.1.56:8081'],
  exposedHeaders,
}));
const system = getInstagramSystem();


// ---- Middlewares ----

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Inyectar el sistema en los controladores si es necesario
app.use((req, res, next) => {
  req.system = system;
  next();
});

// ---- Rutas ----
app.use(authRoutes);
app.use(usersRoutes);
app.use(postsRoutes);
app.use(searchRoutes);

// ---- Error handler ---- Siempre al final
app.use(errorHandler);

export default app;
