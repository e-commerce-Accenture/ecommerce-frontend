import { getToken, removeToken, isAuthenticated as isLoggedIn } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL;

export { isLoggedIn };

// ─── HELPERS LOCALSTORAGE (guest) ────────────────────────────────────────────

function getLocalCart() {
    try {
        return JSON.parse(localStorage.getItem('carrinho')) || [];
    } catch {
        return [];
    }
}

function setLocalCart(items) {
    localStorage.setItem('carrinho', JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cartChange'));
}

// ─── HELPERS API ──────────────────────────────────────────────────────────────

async function apiRequest(path, method = 'GET', body = null) {
    const opts = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_URL}${path}`, opts);
    if (res.status === 403) {
        removeToken();
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("authChange"));
        window.dispatchEvent(new CustomEvent("cartChange"));
        throw new Error("Sua sessão expirou. Por favor, faça login novamente.");
    }
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || json.error || `Erro ${res.status}`);
    return json;
}

// ─── GET /cart ────────────────────────────────────────────────────────────────
// Retorna array de { id (cartItemId), productId, quantity }
export async function getCart() {
    if (!isLoggedIn()) {
        // Guest: retorna localStorage já no formato esperado
        return getLocalCart().map(item => ({
            cartItemId: null,           // sem id de item de API
            productId: item.id,
            quantity: item.quantidade,
            // dados já enriquecidos do localStorage
            nome: item.nome,
            precoAtual: item.precoAtual,
            precoOriginal: item.precoOriginal,
            imagem: item.imagem
        }));
    }

    const data = await apiRequest('/cart');
    const items = Array.isArray(data) 
        ? data 
        : (data.items || data.cart || data.data || data.cartItems || []);
    return items;
}

// ─── POST /cart ───────────────────────────────────────────────────────────────
// body: { productId, quantity }
export async function addToCart(productId, quantity = 1) {
    if (!isLoggedIn()) {
        // Guest: salva no localStorage
        const cart = getLocalCart();
        const existing = cart.find(i => i.id === productId);
        if (existing) {
            existing.quantidade = (existing.quantidade || 1) + quantity;
        } else {
            cart.push({ id: productId, quantidade: quantity });
        }
        setLocalCart(cart);
        return { productId, quantity };
    }

    try {
        const cartItems = await getCart();
        const existing = cartItems.find(item => {
            if (!item) return false;
            const pId = item.productId || 
                        item.product_id || 
                        (item.product && (item.product.id || item.product.productId)) ||
                        item.id;
            return pId === productId;
        });

        if (existing) {
            const itemId = existing.cartItemId || 
                           existing.productId || 
                           existing.id;
            if (itemId) {
                const currentQty = Number(existing.quantity || existing.quantidade || existing.qty || 0);
                const newQty = currentQty + quantity;
                return await updateCartItem(itemId, newQty);
            }
        }
    } catch (e) {
        // Fallback: se falhar a checagem prévia, prossegue com o fluxo POST normal
    }

    return apiRequest('/cart', 'POST', { productId, quantity });
}

// ─── PATCH /cart/items/:id ────────────────────────────────────────────────────
// body: { quantity }
export async function updateCartItem(cartItemId, quantity) {
    if (!isLoggedIn()) {
        // Guest: atualiza quantidade pelo productId
        const cart = getLocalCart();
        const item = cart.find(i => i.id === cartItemId);
        if (item) item.quantidade = quantity;
        setLocalCart(cart);
        return { cartItemId, quantity };
    }

    return apiRequest(`/cart/items/${cartItemId}`, 'PATCH', { quantity });
}

// ─── DELETE /cart/items/:id ───────────────────────────────────────────────────
export async function removeCartItem(cartItemId) {
    if (!isLoggedIn()) {
        // Guest: remove pelo productId
        const cart = getLocalCart().filter(i => i.id !== cartItemId);
        setLocalCart(cart);
        return {};
    }

    return apiRequest(`/cart/items/${cartItemId}`, 'DELETE');
}

// ─── SYNC: migra localStorage → API ao fazer login ───────────────────────────
export async function syncLocalCartToApi() {
    if (!isLoggedIn()) return;
    const localItems = getLocalCart();
    if (!localItems.length) return;

    for (const item of localItems) {
        try {
            await addToCart(item.id, item.quantidade || 1);
        } catch (e) {
            console.warn('Falha ao sincronizar item do carrinho local:', e);
        }
    }
    // Limpa o carrinho local após sincronização
    localStorage.removeItem('carrinho');
    window.dispatchEvent(new CustomEvent('cartChange'));
}
