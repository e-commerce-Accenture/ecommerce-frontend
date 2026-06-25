console.log("🔴 API.JS CARREGADO - VERSÃO NOVA");

export async function fazerRequisição(endpoint, data) {
    console.log("fazendo requisição para:", import.meta.env.VITE_API_URL + endpoint);
    const res = await fetch(import.meta.env.VITE_API_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const text = await res.text();
     console.log("status:", res.status);
    console.log("resposta bruta:", text);

    const json = JSON.parse(text);

if(!res.ok) {
    throw new Error(json.message || `Erro ${res.status}`);
}

    return json;
}