export async function fazerRequisição(endpoint, data) {
    const url = import.meta.env.VITE_API_URL + endpoint;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const text = await res.text();

    let json = {};
    try {
        json = text ? JSON.parse(text) : {};
    } catch (e) {
        console.error("Erro ao parsear JSON da resposta:", e);
        if (!res.ok) {
            throw new Error(`Erro ${res.status}: Resposta inválida do servidor.`);
        }
    }

    if (!res.ok) {
        throw new Error(json.message || json.error || `Erro ${res.status}`);
    }

    return json;
}