const API_URL = import.meta.env.VITE_API_URL;

export async function getBanners() {
    try {
        const res = await fetch(`${API_URL}/banners`);
        if (!res.ok) throw new Error("Erro ao buscar banners");
        const data = await res.json();
        
        const main = [null, null, null];
        const promo = [null, null, null, null, null];
        
        (data || []).forEach(item => {
            try {
                if (item.imgUrl) {
                    const parsed = JSON.parse(item.imgUrl);
                    if (parsed && parsed.slot) {
                        if (parsed.slot.startsWith('main')) {
                            const idx = parseInt(parsed.slot.replace('main', ''), 10) - 1;
                            if (idx >= 0 && idx < 3) {
                                main[idx] = parsed.value;
                            }
                        } else if (parsed.slot.startsWith('p')) {
                            const idx = parseInt(parsed.slot.replace('p', ''), 10) - 1;
                            if (idx >= 0 && idx < 5) {
                                promo[idx] = parsed.value;
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignora erros de JSON caso existam registros antigos em outro formato
            }
        });
        
        return { main, promo };
    } catch (err) {
        console.error("Erro no bannerService:", err);
        // Fallback para localStorage
        try {
            const mainSalvos = JSON.parse(localStorage.getItem('banners_principais')) || [null, null, null];
            const promoSalvos = JSON.parse(localStorage.getItem('banners_promocionais')) || [null, null, null, null, null];
            return {
                main: mainSalvos,
                promo: promoSalvos.map(item => {
                    if (item && typeof item === 'object') {
                        return item.imagem || null;
                    }
                    return item || null;
                })
            };
        } catch (e) {
            return { main: [null, null, null], promo: [null, null, null, null, null] };
        }
    }
}
