import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificar si la ruta es del dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Obtener el token de las cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirigir al login si no hay token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Aquí podrías validar el token con el backend si es necesario
    // Por ahora, solo verificamos que exista
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};