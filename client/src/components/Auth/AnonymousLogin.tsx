import React, { useEffect } from 'react';
import { useAnonymousLogin } from '~/hooks/useAnonymousLogin';
import { Spinner } from '@librechat/client';
import { useLocalize } from '~/hooks';

const AnonymousLogin: React.FC = () => {
  const anonymousLogin = useAnonymousLogin();
  const localize = useLocalize();

  useEffect(() => {
    // Automatically trigger anonymous login when component mounts
    if (!anonymousLogin.isLoading && !anonymousLogin.isSuccess && !anonymousLogin.isError) {
      anonymousLogin.mutate();
    }
  }, [anonymousLogin]);

  if (anonymousLogin.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {localize('com_auth_creating_account')}
          </p>
        </div>
      </div>
    );
  }

  if (anonymousLogin.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-md border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {localize('com_auth_error_creating_account')}: {anonymousLogin.error?.message}
          </div>
          <button
            onClick={() => anonymousLogin.mutate()}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {localize('com_auth_try_again')}
          </button>
        </div>
      </div>
    );
  }

  // This should not be reached as the user will be redirected on success
  return null;
};

export default AnonymousLogin;