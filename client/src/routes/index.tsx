import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import {
  Login,
  VerifyEmail,
  AnonymousLogin,
  ResetPassword,
  ApiErrorWatcher,
  TwoFactorScreen,
  RequestPasswordReset,
} from '~/components/Auth';
import { OAuthSuccess, OAuthError } from '~/components/OAuth';
import RouteErrorBoundary from './RouteErrorBoundary';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
import ChatRoute from './ChatRoute';
import Search from './Search';
import Root from './Root';
import { AuthContextProvider } from '~/hooks/AuthContext';

const AuthLayout = () => (
  <>
    <Outlet />
    <ApiErrorWatcher />
  </>
);

const ProviderRoot = () => (
  <AuthContextProvider>
    <Outlet />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    element: <ProviderRoot />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'share/:shareId',
        element: <ShareRoute />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: 'oauth',
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: 'success',
            element: <OAuthSuccess />,
          },
          {
            path: 'error',
            element: <OAuthError />,
          },
        ],
      },
      {
        path: '/',
        element: <StartupLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: 'anonymous-login',
            element: <AnonymousLogin />,
          },
          {
            path: 'forgot-password',
            element: <RequestPasswordReset />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },
      {
        path: 'verify',
        element: <VerifyEmail />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        element: <AuthLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: '/',
            element: <LoginLayout />,
            children: [
              {
                path: 'login',
                element: <AnonymousLogin />,
              },
              {
                path: 'login/2fa',
                element: <TwoFactorScreen />,
              },
            ],
          },
          dashboardRoutes,
          {
            path: '/',
            element: <Root />,
            children: [
              {
                index: true,
                element: <Navigate to="/anonymous-login" replace={true} />,
              },
              {
                path: 'c/:conversationId?',
                element: <ChatRoute />,
              },
              {
                path: 'search',
                element: <Search />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
