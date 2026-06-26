import { getToken } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL;

// GET /profile — retorna { id, name, email, role }
export async function getProfile() {
    const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error("Erro ao buscar perfil");
    return res.json();
}

// PATCH /profile — aceita { name?, email? }
export async function updateProfileInfo(data) {
    const res = await fetch(`${API_URL}/profile`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || json.error || `Erro ${res.status}`);
    return json;
}

// Endereço salvo localmente (API ainda não suporta esse endpoint)
export function getAddressLocal() {
    const saved = localStorage.getItem("user_address");
    return saved ? JSON.parse(saved) : { phone: "", cep: "", street: "", number: "", neighborhood: "", city: "", state: "" };
}

export async function saveAddressLocal(addressData) {
    localStorage.setItem("user_address", JSON.stringify(addressData));
    const payload = {
        phone: addressData.phone || "",
        cep: addressData.cep || "",
        street: addressData.street || "",
        number: addressData.number || "",
        neighborhood: addressData.neighborhood || "",
        city: addressData.city || "",
        state: addressData.state || ""
    };
    return updateProfileInfo(payload);
}

export function getUserIdFromToken() {
    const token = getToken();
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        return payload.id || null;
    } catch (e) {
        console.error("Erro ao decodificar token para obter ID:", e);
        return null;
    }
}

export async function updatePassword(newPassword) {
    const res = await fetch(`${API_URL}/profile/change-password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ password: newPassword })
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json.message || json.error || `Erro ${res.status}`);
    return json;
}