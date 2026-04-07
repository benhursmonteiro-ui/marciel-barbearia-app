export function setAuthCookie(user: any) {
    if (typeof window === 'undefined') return;
    
    // Simplificado para fins de exemplo — o ideal seria um token JWT
    const cookieData = encodeURIComponent(JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email
    }));
    
    // Cookie expira em 7 dias
    const date = new Date();
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    
    document.cookie = `mbs_session=${cookieData}${expires}; path=/; SameSite=Lax`;
}

export function clearAuthCookie() {
    if (typeof window === 'undefined') return;
    document.cookie = "mbs_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function getAuthSession(cookieString?: string) {
    let rawCookie = '';
    
    if (cookieString) {
        rawCookie = cookieString;
    } else if (typeof window !== 'undefined') {
        rawCookie = document.cookie;
    } else {
        return null;
    }

    const matches = rawCookie.match(/mbs_session=([^;]+)/);
    if (!matches) return null;

    try {
        return JSON.parse(decodeURIComponent(matches[1]));
    } catch (e) {
        return null;
    }
}
