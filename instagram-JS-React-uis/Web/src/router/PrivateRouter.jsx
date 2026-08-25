import { Route, Routes, Navigate } from 'react-router-dom';
import {
  HomeView,
  PostFormView,
  UserProfileView,
  ProfileView,
  PostDetailView,
  SearchView,
} from '../views';
import AppShell from '../components/App/AppShell';

export const PrivateRouter = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/new-post" element={<PostFormView />} />
        <Route path="/user_profile" element={<UserProfileView />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path="/posts/:id" element={<PostDetailView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="*" element={<Navigate to="/" replace />} />{' '}
        {/* fallback para rutas no encontradas dentro de la sección privada */}
      </Routes>
    </AppShell>
  );
};
