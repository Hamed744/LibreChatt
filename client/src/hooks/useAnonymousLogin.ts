import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import { setTokenHeader } from 'librechat-data-provider';
import type { TLoginResponse } from 'librechat-data-provider';

interface AnonymousLoginResponse {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar: string | null;
    anonymousId: string;
    provider: string;
  };
  token: string;
  isNew: boolean;
  message: string;
}

const anonymousLogin = async (): Promise<AnonymousLoginResponse> => {
  const response = await fetch('/api/auth/anonymous-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Anonymous login failed');
  }

  return response.json();
};

export const useAnonymousLogin = () => {
  const navigate = useNavigate();
  const { setUserContext } = useAuthContext();

  return useMutation({
    mutationFn: anonymousLogin,
    onSuccess: (data: AnonymousLoginResponse) => {
      const { user, token, isNew } = data;
      
      // Set token header for API calls
      setTokenHeader(token);
      
      // Update auth context
      setUserContext({
        token,
        isAuthenticated: true,
        user,
        redirect: '/c/new',
      });

      console.log(`Anonymous user ${isNew ? 'created' : 'logged in'} successfully`);
    },
    onError: (error: Error) => {
      console.error('Anonymous login error:', error);
      // Redirect to error page or show error message
      navigate('/login?error=anonymous_login_failed');
    },
  });
};