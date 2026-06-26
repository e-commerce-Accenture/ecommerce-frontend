/**
 * tokenService.js
 * Gerencia o token JWT em cookies (não-HttpOnly via JS).
 * Vantagem sobre localStorage: sobrevive a localStorage.clear().
 * O cookie expira em 1h (seguindo o JWT do backend) e é apagado no logout.
 */

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60; // 1 hora em segundos

export function setToken(token) {
    // path=/ → válido em todas as rotas
    // SameSite=Strict → protege contra CSRF
    document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Strict`;
    // Mantém também no localStorage para compatibilidade com código legado que ainda não migrou
    localStorage.setItem('token', token);
}

export function getToken() {
    // 1. Tenta ler do cookie (sobrevive a localStorage.clear)
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${COOKIE_NAME}=`));
    if (cookie) {
        const tokenVal = cookie.split('=')[1];
        
        // Se o token está no cookie mas sumiu do localStorage (ex: clear), restaura tudo
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', tokenVal);
        }
        
        try {
            if (!localStorage.getItem('user_role') || !localStorage.getItem('user_email')) {
                const base64Url = tokenVal.split('.')[1];
                if (base64Url) {
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    );
                    const payload = JSON.parse(jsonPayload);
                    if (payload.role && !localStorage.getItem('user_role')) {
                        localStorage.setItem('user_role', payload.role);
                    }
                    if (payload.email && !localStorage.getItem('user_email')) {
                        localStorage.setItem('user_email', payload.email);
                    }
                }
            }
        } catch (e) {
            console.error("Erro ao auto-restaurar dados do token no localStorage:", e);
        }
        
        return tokenVal;
    }

    // 2. Fallback: localStorage (compatibilidade)
    return localStorage.getItem('token') || null;
}

export function removeToken() {
    // Remove o cookie zerando max-age
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
    localStorage.removeItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}
