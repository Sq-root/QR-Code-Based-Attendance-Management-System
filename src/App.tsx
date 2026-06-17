import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Toaster from './components/ui/Toaster';

export default function App() {
  return (
    <ErrorBoundary>
      <Login />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}
