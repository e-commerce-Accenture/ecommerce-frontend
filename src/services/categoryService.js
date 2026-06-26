const API_URL = import.meta.env.VITE_API_URL;

// Mapeamento: nome da API → label em português para exibição
const LABEL_MAP = {
    Mobile: 'Smartphone',
    Watcher: 'Smartwatch',
    Acessory: 'Acessórios',
    SmartPhone: 'Smartphone',
    SmartWatch: 'Smartwatch',
};

// Mapeamento: nome da API → palavras-chave que combinam com campo `categoria` do produto local
const CATEGORIA_KEYWORDS = {
    Mobile: ['samsung', 'apple', 'smartphone', 'mobile', 'phone'],
    Watcher: ['watch', 'watcher', 'smartwatch'],
    Acessory: ['acessorio', 'acessórios', 'acessory', 'accessory'],
    SmartPhone: ['samsung', 'apple', 'smartphone', 'mobile', 'phone'],
    SmartWatch: ['watch', 'watcher', 'smartwatch'],
};

/**
 * Retorna todas as categorias da API.
 * @returns {Promise<Array<{id: string, name: string, imgUrl: string, label: string}>>}
 */
const CATEGORY_ORDER = ['Mobile', 'SmartPhone', 'Watcher', 'SmartWatch', 'Acessory'];

export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Erro ao buscar categorias');
    const data = await res.json();
    return data
        .map(cat => ({
            ...cat,
            label: LABEL_MAP[cat.name] ?? cat.name,
            keywords: CATEGORIA_KEYWORDS[cat.name] ?? [cat.name.toLowerCase()],
        }))
        .sort((a, b) => {
            const indexA = CATEGORY_ORDER.indexOf(a.name);
            const indexB = CATEGORY_ORDER.indexOf(b.name);
            return (indexA !== -1 ? indexA : 99) - (indexB !== -1 ? indexB : 99);
        });
}

/**
 * Retorna uma única categoria pelo ID.
 * @param {string} id UUID da categoria
 */
export async function getCategoryById(id) {
    const res = await fetch(`${API_URL}/categories/${id}`);
    if (!res.ok) throw new Error(`Categoria ${id} não encontrada`);
    const cat = await res.json();
    return { ...cat, label: LABEL_MAP[cat.name] ?? cat.name };
}

/**
 * Retorna o ID da categoria da API que corresponde ao campo `categoria` local de um produto.
 * Útil para associar produtos locais às categorias da API antes da integração completa.
 * @param {string} categoriaLocal ex: "Samsung", "Apple Watch"
 * @param {Array} categorias lista retornada por getCategories()
 * @returns {string|null} UUID da categoria correspondente
 */
export function resolverCategoriaId(categoriaLocal, categorias) {
    const cat = (categoriaLocal || '').toLowerCase();
    const encontrada = categorias.find(c =>
        c.keywords.some(kw => cat.includes(kw))
    );
    return encontrada?.id ?? null;
}
