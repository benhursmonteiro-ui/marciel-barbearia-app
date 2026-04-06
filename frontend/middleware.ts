import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('mbs_session');
    let user = null;

    if (sessionCookie) {
        try {
            user = JSON.parse(decodeURIComponent(sessionCookie.value));
        } catch (e) {
            console.error('Erro ao analisar cookie de sessão no middleware');
        }
    }

    const { pathname } = request.nextUrl;

    // 1. Se estiver logado e tentar acessar a página de login (/), redireciona para o dashboard correto
    if (pathname === '/' && user) {
        const destination = user.role === 'admin' ? '/admin' : user.role === 'barber' ? '/barber' : '/client';
        return NextResponse.redirect(new URL(destination, request.url));
    }

    // 2. Proteção de rotas ADMIN
    if (pathname.startsWith('/admin')) {
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 3. Proteção de rotas BARBER
    if (pathname.startsWith('/barber')) {
        if (!user || (user.role !== 'barber' && user.role !== 'admin')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 4. Proteção de rotas CLIENT
    if (pathname.startsWith('/client')) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Configura em quais caminhos o middleware deve rodar
export const config = {
    matcher: ['/', '/admin/:path*', '/barber/:path*', '/client/:path*'],
};
