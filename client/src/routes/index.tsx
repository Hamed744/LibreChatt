import { createBrowserRouter } from 'react-router-dom';
import RouteErrorBoundary from './RouteErrorBoundary';
import AppSimple from '../AppSimple';

export const router = createBrowserRouter([
  {
    path: '*',
    element: <AppSimple />,
    errorElement: <RouteErrorBoundary />,
  },
]);
