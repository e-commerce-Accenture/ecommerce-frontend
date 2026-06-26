import { useEffect, useState } from "react";
import { getProfile, updateProfileInfo, getAddressLocal, saveAddressLocal, updatePassword } from "../services/profileService";
import { User, Mail, Phone, MapPin, Save, ShieldCheck, MapPinned, ChevronRight, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PerfilPage() {
    
    const [accountForm, setAccountForm] = useState({ name: "", email: "" });
    const [initialAccountForm, setInitialAccountForm] = useState({ name: "", email: "" });
    const [accountLoading, setAccountLoading] = useState(false);
    const [accountSuccess, setAccountSuccess] = useState("");
    const [accountError, setAccountError] = useState("");

    
    const [addressForm, setAddressForm] = useState({
        phone: "", cep: "", street: "", number: "", neighborhood: "", city: "", state: ""
    });
    const [addressSuccess, setAddressSuccess] = useState("");
    const [addressError, setAddressError] = useState("");
    const [addressLoading, setAddressLoading] = useState(false);

    
    const [senhaForm, setSenhaForm] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
    });
    const [senhaSuccess, setSenhaSuccess] = useState("");
    const [senhaError, setSenhaError] = useState("");
    const [senhaLoading, setSenhaLoading] = useState(false);

    const userRole = localStorage.getItem("user_role") || "client";

    
    useEffect(() => {
        async function load() {
            try {
                const data = await getProfile();
                const profileData = { name: data.name || "", email: data.email || "" };
                setAccountForm(profileData);
                setInitialAccountForm(profileData);

                
                if (data.address || data.phone) {
                    const apiAddr = {
                        phone: data.phone || "",
                        cep: data.address?.cep || "",
                        street: data.address?.street || "",
                        number: data.address?.number || "",
                        neighborhood: data.address?.neighborhood || "",
                        city: data.address?.city || "",
                        state: data.address?.state || ""
                    };
                    setAddressForm(apiAddr);
                    localStorage.setItem("user_address", JSON.stringify(apiAddr));
                } else {
                    setAddressForm(getAddressLocal());
                }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setAccountError("Não foi possível carregar os dados da conta.");
            }
        }
        load();
    }, []);

    function handleAccountChange(e) {
        const { name, value } = e.target;
        setAccountForm(prev => ({ ...prev, [name]: value }));
    }

    function handleAddressChange(e) {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSenhaChange(e) {
        const { name, value } = e.target;
        setSenhaForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleAccountSubmit(e) {
        e.preventDefault();

        
        const payload = {};
        const nameChanged = accountForm.name.trim() !== initialAccountForm.name.trim();
        const emailChanged = accountForm.email.trim().toLowerCase() !== initialAccountForm.email.trim().toLowerCase();

        if (nameChanged) payload.name = accountForm.name.trim();
        if (emailChanged) payload.email = accountForm.email.trim().toLowerCase();

        
        if (Object.keys(payload).length === 0) {
            setAccountSuccess("Dados da conta já estão atualizados!");
            setTimeout(() => setAccountSuccess(""), 4000);
            return;
        }

        setAccountLoading(true);
        setAccountSuccess("");
        setAccountError("");
        try {
            const updated = await updateProfileInfo(payload);
            const newProfileData = {
                name: updated.name || accountForm.name,
                email: updated.email || accountForm.email
            };
            setAccountForm(newProfileData);
            setInitialAccountForm(newProfileData);
            
            
            if (updated.email) localStorage.setItem("user_email", updated.email);
            setAccountSuccess("Dados da conta atualizados com sucesso!");
            window.dispatchEvent(new CustomEvent("authChange"));
            setTimeout(() => setAccountSuccess(""), 4000);
        } catch (err) {
            console.error(err);
            setAccountError(err.message || "Erro ao atualizar conta.");
        } finally {
            setAccountLoading(false);
        }
    }

    async function handleAddressSubmit(e) {
        e.preventDefault();
        setAddressLoading(true);
        setAddressSuccess("");
        setAddressError("");
        try {
            await saveAddressLocal(addressForm);
            setAddressSuccess("Endereço salvo com sucesso!");
            setTimeout(() => setAddressSuccess(""), 4000);
        } catch (err) {
            console.error("Erro ao salvar endereço:", err);
            setAddressError(err.message || "Erro ao salvar o endereço no servidor.");
        } finally {
            setAddressLoading(false);
        }
    }

    async function handleSenhaSubmit(e) {
        e.preventDefault();
        setSenhaSuccess("");
        setSenhaError("");

        if (!senhaForm.senhaAtual) {
            setSenhaError("Informe sua senha atual.");
            return;
        }
        if (senhaForm.novaSenha.length < 6) {
            setSenhaError("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
            setSenhaError("As senhas não conferem.");
            return;
        }

        setSenhaLoading(true);
        try {
            await updatePassword(senhaForm.novaSenha);
            setSenhaSuccess("Senha alterada com sucesso!");
            setSenhaForm({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
            setTimeout(() => setSenhaSuccess(""), 4000);
        } catch (err) {
            console.error("Erro ao alterar senha:", err);
            setSenhaError(err.message || "Erro ao alterar a senha no servidor.");
        } finally {
            setSenhaLoading(false);
        }
    }

    const userEmail = accountForm.email || localStorage.getItem("user_email") || "cliente@nextgen.com";
    const userName = accountForm.name || userEmail.split("@")[0];
    const avatarLetter = userName[0]?.toUpperCase() || "U";

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-800 font-sans w-full">
            
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                <Link to="/" className="hover:text-blue-500 font-medium">Home</Link>

                <ChevronRight size={12} className="text-gray-400" />

                <span className="text-gray-900 font-semibold">Meu Perfil</span>

            </div>


            
            <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                        {avatarLetter}
                    </div>

                    <div className="text-left">
                        <h1 className="text-xl font-extrabold text-gray-900">{userName}</h1>

                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail size={14} className="text-gray-400" /> {userEmail}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                    <span className="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Conta Ativa

                    </span>

                    <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                        {userRole === "admin" ? "Administrador" : "Cliente"}
                    </span>

                </div>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                
                <div className="space-y-8">
                    
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                            <User className="text-blue-500" size={20} /> Dados da Conta

                        </h2>


                        {accountSuccess && (
                            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl p-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>

                                {accountSuccess}
                            </div>

                        )}
                        {accountError && (
                            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl p-4 flex items-start gap-2">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {accountError}

                            </div>

                        )}

                        <form onSubmit={handleAccountSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome completo</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <User size={16} />

                                    </div>

                                    <input
                                        name="name"
                                        type="text"
                                        value={accountForm.name}
                                        onChange={handleAccountChange}
                                        placeholder="Seu nome"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                    />

                                </div>

                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">E-mail</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={16} />

                                    </div>

                                    <input
                                        name="email"
                                        type="email"
                                        value={accountForm.email}
                                        onChange={handleAccountChange}
                                        placeholder="seu@email.com"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                disabled={accountLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />

                                {accountLoading ? "Salvando..." : "Salvar Dados da Conta"}
                            </button>

                        </form>

                    </div>


                    
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                            <Lock className="text-blue-500" size={20} /> Alterar Senha

                        </h2>


                        {senhaSuccess && (
                            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl p-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>

                                {senhaSuccess}
                            </div>

                        )}
                        {senhaError && (
                            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl p-4 flex items-start gap-2">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" /> {senhaError}

                            </div>

                        )}

                        <form onSubmit={handleSenhaSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Senha Atual</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={16} />

                                    </div>

                                    <input
                                        name="senhaAtual"
                                        type="password"
                                        value={senhaForm.senhaAtual}
                                        onChange={handleSenhaChange}
                                        placeholder="Sua senha atual"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                    />

                                </div>

                            </div>


                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nova Senha</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={16} />

                                    </div>

                                    <input
                                        name="novaSenha"
                                        type="password"
                                        value={senhaForm.novaSenha}
                                        onChange={handleSenhaChange}
                                        placeholder="Nova senha (mín. 6 caracteres)"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                    />

                                </div>

                            </div>


                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirmar Nova Senha</label>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={16} />

                                    </div>

                                    <input
                                        name="confirmarSenha"
                                        type="password"
                                        value={senhaForm.confirmarSenha}
                                        onChange={handleSenhaChange}
                                        placeholder="Confirme a nova senha"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                disabled={senhaLoading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />

                                {senhaLoading ? "Alterando..." : "Alterar Senha"}
                            </button>

                        </form>

                    </div>

                </div>


                
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
                    <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
                        <MapPin className="text-blue-500" size={20} /> Endereço & Contato

                    </h2>


                    {addressSuccess && (
                        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl p-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>

                            {addressSuccess}
                        </div>

                    )}
                    {addressError && (
                        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl p-4 flex items-start gap-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {addressError}

                        </div>

                    )}

                    <form onSubmit={handleAddressSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefone</label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Phone size={16} />

                                </div>

                                <input
                                    name="phone"
                                    type="text"
                                    value={addressForm.phone}
                                    onChange={handleAddressChange}
                                    placeholder="(11) 99999-9999"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all"
                                />

                            </div>

                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CEP</label>

                                <input name="cep" type="text" value={addressForm.cep} onChange={handleAddressChange} placeholder="00000-000" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Número</label>

                                <input name="number" type="text" value={addressForm.number} onChange={handleAddressChange} placeholder="Ex: 123" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                            </div>

                        </div>


                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rua / Logradouro</label>

                            <input name="street" type="text" value={addressForm.street} onChange={handleAddressChange} placeholder="Avenida Paulista" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                        </div>


                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bairro</label>

                                <input name="neighborhood" type="text" value={addressForm.neighborhood} onChange={handleAddressChange} placeholder="Centro" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cidade</label>

                                <input name="city" type="text" value={addressForm.city} onChange={handleAddressChange} placeholder="São Paulo" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estado</label>

                                <input name="state" type="text" value={addressForm.state} onChange={handleAddressChange} placeholder="SP" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none text-sm transition-all" />

                            </div>

                        </div>


                        <button
                            type="submit"
                            disabled={addressLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={16} />

                            {addressLoading ? "Salvando..." : "Salvar Endereço"}
                        </button>

                    </form>


                    
                    <div className="mt-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                            <MapPinned size={120} />

                        </div>

                        <h4 className="text-sm font-bold mb-1">Seus dados de entrega</h4>

                        <p className="text-xs opacity-90 leading-relaxed">
                            Mantenha seu endereço atualizado para compras rápidas e entregas imediatas!
                        </p>

                    </div>

                </div>


            </div>

        </main>

    );
}