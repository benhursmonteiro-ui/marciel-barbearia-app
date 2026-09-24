import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('mbs_session');
    let user = null;

    if (sessionCookie?.value) {
        try {
            const decodedValue = decodeURIComponent(sessionCookie.value);
            user = JSON.parse(decodedValue);
        } catch (e) {
            try {
                user = JSON.parse(sessionCookie.value);
            } catch (err) {
                user = null;
            }
        }
    }

    const url = new URL(request.url);
    const userRole = user?.role ? String(user.role).toLowerCase() : null;

    // Se o usuário estiver bloqueado, impede o acesso
    if (user && user.blocked) {
        if (url.pathname !== '/') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Proteção ADMIN
    if (url.pathname.startsWith('/admin')) {
        if (!user || userRole !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Proteção BARBER
    if (url.pathname.startsWith('/barber')) {
        if (!user || (userRole !== 'barber' && userRole !== 'admin')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // As rotas / e /client são públicas para agendamento direto!
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*', '/barber/:path*', '/client/:path*'],
};

