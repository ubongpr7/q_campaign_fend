// utils/refreshUserToken.ts
import env from '@/env_file';
import { setCookie } from 'cookies-next';

export const refreshUserToken = async (
  refreshToken: string | undefined,
  pathname: string,
  router: any // Pass the router object from the component
) => {
  if (!refreshToken) {
    if (!pathname.startsWith('/accounts') && pathname !== '/') {
      router.push(`/accounts/login?next=${encodeURIComponent(pathname)}`);
    }
    return;
  }

  try {
    const response = await fetch(`${env.BACKEND_HOST_URL}/jwt/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${refreshToken}`,
      },
      body:  refreshToken ,
    });

    if (response.ok) {
      const data = await response.json();
      setCookie('accessToken', data.access, { maxAge: 50 * 60 }); // 50 minutes
      setCookie('refreshToken', data.refresh, { maxAge: 10 * 24 * 60 * 60 }); // 10 days
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.log('Error refreshing token:', error);
    if (!pathname.startsWith('/accounts') && pathname !== '/') {
      router.push(`/accounts/login?next=${encodeURIComponent(pathname)}`);
    }
  }
};