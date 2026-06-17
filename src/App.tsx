import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES, AUTH_KEYS } from './constants';
import Toaster from './components/ui/Toaster';
import LoadingSpinner from './components/LoadingSpinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));

// Helper component to guard routes that require authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem(AUTH_KEYS.TOKEN);
  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <>{children}</>;
};

// Helper component to guard routes that should only be accessible to unauthenticated users
const AnonymousOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem(AUTH_KEYS.TOKEN);
  if (token) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <>{children}</>;
};

// Define client routes
const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <ErrorBoundary>
        <AnonymousOnly>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
              <LoadingSpinner size="md" label="Loading portal..." />
            </div>
          }>
            <Login />
          </Suspense>
        </AnonymousOnly>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.HOME,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
              <LoadingSpinner size="lg" label="Initializing secure session..." />
            </div>
          }>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none font-sans">
        <h1 className="text-display-lg text-on-background mb-2">404</h1>
        <p className="text-on-surface-variant mb-6 text-body-sm">The requested route does not exist.</p>
        <a
          href={ROUTES.HOME}
          className="px-4 py-2 bg-secondary hover:opacity-90 text-on-secondary rounded-DEFAULT text-label-md transition-all font-sans font-semibold shadow-sm"
        >
          Return Home
        </a>
      </div>
    ),
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
