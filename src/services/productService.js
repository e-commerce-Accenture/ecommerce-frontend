import { getToken } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL;

// Mapeamento de categorias IDs para nomes
const CATEGORY_NAMES = {
    '361bb008-4f45-487a-b1f0-0598911ab267': 'Smartphone',
    '70b56836-1866-4936-bb34-813a9685c54e': 'Smartwatch',
    'Acessory': 'Acessórios',
    'Mobile': 'Smartphone',
    'Watcher': 'Smartwatch',
    'SmartPhone': 'Smartphone',
    'SmartWatch': 'Smartwatch',
};

/**
 * Mapeia o produto retornado pela API para o formato esperado pelo front-end.
 */
export function mapApiProductToLocal(apiProd) {
    if (!apiProd) return null;
    return {
        id: apiProd.id,
        nome: apiProd.name || "Produto sem Nome",
        precoAtual: Number(apiProd.currentPrice) || 0,
        precoOriginal: Number(apiProd.originalPrice) || Number(apiProd.currentPrice) || 0,
        desconto: Number(apiProd.discount) || 0,
        imagem: apiProd.image || "",
        categoriaId: apiProd.categoryId || "",
        categoria: CATEGORY_NAMES[apiProd.categoryId] || apiProd.categoryId || "SmartPhone",
        estoque: Number(apiProd.stock) || 0,
        marca: apiProd.brand || "Generico",
        descricao: apiProd.description || `Explore novas possibilidades com o ${apiProd.name || "produto"}.`,
        especificacoes: (() => {
            const apiSpecs = {};
            const rawAttrs = apiProd.attributes || apiProd.specifications || apiProd.especificacoes;
            if (Array.isArray(rawAttrs)) {
                rawAttrs.forEach(attr => {
                    const title = attr.title || attr.name || attr.chave || attr.key;
                    const val = attr.value || attr.valor || attr.paragraph;
                    if (title) apiSpecs[title] = val;
                });
            } else if (rawAttrs && typeof rawAttrs === 'object') {
                Object.entries(rawAttrs).forEach(([k, v]) => {
                    apiSpecs[k] = v;
                });
            }
            if (Object.keys(apiSpecs).length > 0) {
                return apiSpecs;
            }
            try {
                const saved = localStorage.getItem(`prod_specs_${apiProd.id}`);
                return saved ? JSON.parse(saved) : { Marca: apiProd.brand || "Generico" };
            } catch (e) {
                return { Marca: apiProd.brand || "Generico" };
            }
        })()
    };
}

/**
 * Mapeia o produto do front-end para o payload de criação/atualização da API.
 */
export function mapLocalProductToApi(localProd) {
    if (!localProd) return null;
    return {
        name: localProd.nome,
        currentPrice: Number(localProd.precoAtual),
        originalPrice: Number(localProd.precoOriginal || localProd.precoAtual),
        discount: Number(localProd.desconto) || 0,
        image: localProd.imagem || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        categoryId: localProd.categoriaId || "361bb008-4f45-487a-b1f0-0598911ab267",
        stock: Number(localProd.estoque) || 0,
        brand: localProd.marca || "Generico",
        description: localProd.descricao || ""
    };
}

// GET /products
export async function getProducts() {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Erro ao buscar produtos da API");
    const data = await res.json();
    return (data || []).map(mapApiProductToLocal);
}

// GET /products/:id
export async function getProductById(id) {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) throw new Error(`Erro ao buscar produto com ID ${id}`);
    const data = await res.json();
    return mapApiProductToLocal(data);
}

// GET /products/category/:id
export async function getProductsByCategory(categoryId) {
    const res = await fetch(`${API_URL}/products/category/${categoryId}`);
    if (!res.ok) throw new Error(`Erro ao buscar produtos da categoria ${categoryId}`);
    const data = await res.json();
    return (data || []).map(mapApiProductToLocal);
}

// GET /products/brand/:brand
export async function getProductsByBrand(brand) {
    const res = await fetch(`${API_URL}/products/brand/${brand}`);
    if (!res.ok) throw new Error(`Erro ao buscar produtos da marca ${brand}`);
    const data = await res.json();
    return (data || []).map(mapApiProductToLocal);
}

// POST /products (agora aceita description diretamente)
export async function createProduct(localProductData) {
    const apiPayload = mapLocalProductToApi(localProductData);
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(apiPayload)
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
        console.error("❌ API /products error payload:", JSON.stringify(apiPayload, null, 2));
        console.error("❌ API /products response:", JSON.stringify(json, null, 2));
        throw new Error(json.message || json.error || `Erro ${res.status} ao criar produto`);
    }

    const mapped = mapApiProductToLocal(json);
    const prodId = mapped.id;

    if (localProductData.especificacoes) {
        localStorage.setItem(`prod_specs_${prodId}`, JSON.stringify(localProductData.especificacoes));
        mapped.especificacoes = localProductData.especificacoes;
        try {
            for (const [title, value] of Object.entries(localProductData.especificacoes)) {
                await addProductAttribute(prodId, title, value);
            }
        } catch (e) {
            console.error("Erro ao sincronizar especificações ao criar produto:", e);
        }
    }

    window.dispatchEvent(new Event("storage"));
    return mapped;
}

// PATCH /product/:id  (note: "/product" in singular)
export async function updateProduct(id, localProductData) {
    // Only map the fields that are allowed by the backend schema
    const apiPayload = {};
    if (localProductData.nome !== undefined) apiPayload.name = localProductData.nome;
    if (localProductData.precoAtual !== undefined) apiPayload.currentPrice = Number(localProductData.precoAtual);
    if (localProductData.precoOriginal !== undefined) apiPayload.originalPrice = Number(localProductData.precoOriginal);
    if (localProductData.desconto !== undefined) apiPayload.discount = Number(localProductData.desconto);
    if (localProductData.imagem !== undefined) apiPayload.image = localProductData.imagem || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    if (localProductData.categoriaId !== undefined) apiPayload.categoryId = localProductData.categoriaId;
    if (localProductData.estoque !== undefined) apiPayload.stock = Number(localProductData.estoque);
    if (localProductData.marca !== undefined) apiPayload.brand = localProductData.marca;
    if (localProductData.descricao !== undefined) apiPayload.description = localProductData.descricao;

    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(apiPayload)
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) {
        console.error("❌ PATCH /products error payload:", JSON.stringify(apiPayload, null, 2));
        console.error("❌ PATCH /products response:", JSON.stringify(json, null, 2));
        throw new Error(json.message || json.error || `Erro ${res.status} ao atualizar produto`);
    }

    const mapped = mapApiProductToLocal(json);
    if (localProductData.especificacoes !== undefined) {
        localStorage.setItem(`prod_specs_${id}`, JSON.stringify(localProductData.especificacoes));
        mapped.especificacoes = localProductData.especificacoes;
        try {
            for (const [title, value] of Object.entries(localProductData.especificacoes)) {
                await addProductAttribute(id, title, value);
            }
        } catch (e) {
            console.error("Erro ao sincronizar especificações ao atualizar produto:", e);
        }
    }

    window.dispatchEvent(new Event("storage"));
    return mapped;
}

// DELETE /products/:id
export async function deleteProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || json.error || `Erro ${res.status} ao deletar produto`);

    // Clean up local metadata
    localStorage.removeItem(`prod_specs_${id}`);

    window.dispatchEvent(new Event("storage"));
    return json;
}

// POST /products/:id/attributes
export async function addProductAttribute(id, title, value) {
    try {
        const payload = {
            title,
            paragraph: value
        };
        const res = await fetch(`${API_URL}/products/${id}/attributes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            const errText = await res.text();
            console.error(`❌ addProductAttribute failed with status ${res.status}:`, errText);
            alert(`Erro do Servidor ao salvar atributo (Status ${res.status}):\n${errText}`);
        }
    } catch (e) {
        console.warn("Failed to persist attribute on API. Saving locally.", e);
    }

    // Save to local metadata fallback
    let specs = {};
    try {
        specs = JSON.parse(localStorage.getItem(`prod_specs_${id}`) || '{}');
    } catch (e) {}
    specs[title] = value;
    localStorage.setItem(`prod_specs_${id}`, JSON.stringify(specs));
    window.dispatchEvent(new Event("storage"));
    return { title, value };
}

// DELETE /products/:id/attributes/:tittle
export async function deleteProductAttribute(id, title) {
    try {
        const res = await fetch(`${API_URL}/products/${id}/attributes/${encodeURIComponent(title)}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (e) {
        console.warn("Failed to delete attribute on API. Deleting locally.", e);
    }

    // Remove from local metadata fallback
    let specs = {};
    try {
        specs = JSON.parse(localStorage.getItem(`prod_specs_${id}`) || '{}');
    } catch (e) {}
    delete specs[title];
    localStorage.setItem(`prod_specs_${id}`, JSON.stringify(specs));
    window.dispatchEvent(new Event("storage"));
    return { success: true };
}
