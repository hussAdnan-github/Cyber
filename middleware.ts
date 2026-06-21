import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routePermissions } from './lib/routePermissions';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userDataStr = request.cookies.get('user_data')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access dashboard without a token, redirect to login
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access login page WITH a token, redirect to dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check permissions for dashboard routes
  if (pathname.startsWith('/dashboard') && pathname !== '/dashboard/unauthorized' && token && userDataStr) {
    try {
      const userData = JSON.parse(decodeURIComponent(userDataStr));
      const isSuperuser = userData.is_superuser || false;
      const userPermissions: string[] = userData.permissions || [];

      if (!isSuperuser) {
        let requiredPermissions: string[] | undefined;
        
        if (routePermissions[pathname]) {
          requiredPermissions = routePermissions[pathname];
        } else {
          const paths = Object.keys(routePermissions).sort((a, b) => b.length - a.length);
          for (const p of paths) {
            if (pathname.startsWith(p)) {
              requiredPermissions = routePermissions[p];
              break;
            }
          }
        }

        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.some(rp => userPermissions.includes(rp));
          if (!hasPermission) {
            return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url));
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse user_data in middleware', e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
