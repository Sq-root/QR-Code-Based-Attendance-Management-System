import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';

// Define client routes using the latest React Router data API pattern
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
        <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
        <p className="text-zinc-500 mb-6 text-sm">The requested route does not exist.</p>
        <a
          href="/"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm transition-all"
        >
          Return Home
        </a>
      </div>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
