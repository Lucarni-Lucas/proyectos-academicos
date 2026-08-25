import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { LoginView, RegisterView } from '../views';
import { ProtectedRoute } from './ProtectedRoute';
import { PrivateRouter } from './PrivateRouter';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginView loading={false} error={null} />}
        />
        <Route
          path="/register"
          element={<RegisterView loading={false} error={null} />}
        />
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<PrivateRouter />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />{' '}
        {/* fallback para rutas no encontradas dentro de la sección publica */}
      </Routes>
    </BrowserRouter>
  );
};
