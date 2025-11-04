import { lazy } from 'react';
import { Routes, Route, Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { AppRouter, ProtectedRoute } from '@df/utils';
import { Page403, Page404 } from '@df/ui';
import { LoginPage } from '../pages/LoginPage';
import { routeConfig } from './routeConfig';
import { UserPage } from '../pages/UserPage';

//Lazy-load de páginas
const Login = lazy(() => import('../pages/LoginPage/LoginPage'));
const User = lazy(() => import('../pages/UserPage/UserPage'));
const AdminPage = lazy(() => import('../pages/AdminPage/AdminPage'));
const Technology = lazy(() => import('../pages/Technology/Technology'));
const IndustrialDB = lazy(() => import('../pages/IndustrialDB/IndustrialDB'));
const Project = lazy(() => import('../pages/Project/Project'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/technology-roadmappping" element={<Technology />} />
        <Route path="/industrial-database" element={<IndustrialDB />} />
        <Route path="/project-roadmapping" element={<Project />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute permissions={['users.edit_users']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="/user" element={<UserPage />} />
        <Route path="/403" element={<Page403 />} />
        <Route path="/404" element={<Page404 />} />
        <Route path="*" element={<AppRouter structure={routeConfig} />} />
      </Route>
    </Routes>
  );
}
