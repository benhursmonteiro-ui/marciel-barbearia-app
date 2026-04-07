import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('mbs_session');
    let user = null;

    if (sessionCookie?.value) {
        try {
            // Tenta decodificar o cookie (suporta formatos diferentes de browsers)
            const decodedValue = decodeURIComponent(sessionCookie.value);
            user = JSON.parse(decodedValue);
        } catch (e) {
            console.error('Erro ao ler cookie no middleware, tentando fallback...');
            try {
                // Algumas versões do Next já entregam o valor decodificado
                user = JSON.parse(sessionCookie.value);
            } catch (err) {
                user = null;
            }
        }
    }

    const { pathname } = request.url;
    const url = new URL(request.url);

    // 1. Se estiver logado e for a raiz (/), manda para o dashboard
    if (url.pathname === '/' && user) {
        const destination = user.role === 'admin' ? '/admin' : user.role === 'barber' ? '/barber' : '/client';
        return NextResponse.redirect(new URL(destination, request.url));
    }

    // 2. Proteção ADMIN
    if (url.pathname.startsWith('/admin')) {
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 3. Proteção BARBER
    if (url.pathname.startsWith('/barber')) {
        if (!user || (user.role !== 'barber' && user.role !== 'admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 4. Proteção CLIENTE
    if (url.pathname.startsWith('/client')) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*', '/barber/:path*', '/client/:path*'],
};
