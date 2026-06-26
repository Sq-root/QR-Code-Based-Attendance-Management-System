import React, { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES, AUTH_KEYS } from './constants';
import Toaster from './components/ui/Toaster';
import LoadingSpinner from './components/LoadingSpinner';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const RegisterAttendee = lazy(() => import('./pages/RegisterAttendee'));
const AttendeesList = lazy(() => import('./pages/AttendeesList'));

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
const router = createHashRouter([
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
    path: ROUTES.NEW_ATTENDEE,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
              <LoadingSpinner size="lg" label="Loading attendee form..." />
            </div>
          }>
            <RegisterAttendee />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: ROUTES.ATTENDEES_LIST,
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
              <LoadingSpinner size="lg" label="Loading attendees..." />
            </div>
          }>
            <AttendeesList />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none font-sans bg-surface">
        <p className="text-label-md font-semibold uppercase tracking-[0.18em] text-secondary mb-3">Page not found</p>
        <h1 className="text-display-lg font-bold text-primary mb-2 tracking-tight">404</h1>
        <p className="text-on-surface-variant mb-7 text-body-lg">The requested route does not exist.</p>
        <a
          href={ROUTES.HOME}
          className="inline-flex items-center px-5 py-2.5 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary rounded-lg text-label-md transition-all duration-200 font-sans font-semibold shadow-sm shadow-secondary/25 hover:shadow-md"
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
