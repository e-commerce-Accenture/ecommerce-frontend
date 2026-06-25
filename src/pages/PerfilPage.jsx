import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, CheckCircle, Lock, ArrowLeft, Pencil, Truck, X } from 'lucide-react';

export default function PerfilPage() {

    const navigate = useNavigate();
    const isLogged = !!localStorage.getItem('token');

    useEffect(() => {
        if (!isLogged) {
            navigate('/login');
        }
    }, [isLogged, navigate]);

    const [form, setForm] = useState({
        nome: localStorage.getItem('perfil_nome') || '',
        email: localStorage.getItem('user_email') || '',
        telefone: localStorage.getItem('perfil_telefone') || '',
        cep: localStorage.getItem('perfil_cep') || '',
        rua: localStorage.getItem('perfil_rua') || '',
        numero: localStorage.getItem('perfil_numero') || '',
        bairro: localStorage.getItem('perfil_bairro') || '',
        cidade: localStorage.getItem('perfil_cidade') || '',
        estado: localStorage.getItem('perfil_estado') || '',
        foto: localStorage.getItem('perfil_foto') || '',
    });

    const [senhaForm, setSenhaForm] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: '',
    });

    const [sucesso, setSucesso] = useState('');
    const [erroPerfil, setErroPerfil] = useState('');
    const [erroSenha, setErroSenha] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('dados');

    // Controla se o formulário de endereço está aberto ou fechado
    const [editandoEndereco, setEditandoEndereco] = useState(false);

    // Verifica se já tem endereço salvo
    const temEndereco = form.rua || form.cep || form.cidade;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSenhaChange = (e) => {
        setSenhaForm({ ...senhaForm, [e.target.name]: e.target.value });
    };

    const handleSalvarPerfil = (e) => {
        e.preventDefault();
        setErroPerfil('');
        setSucesso('');
        if (!form.nome.trim()) {
            setErroPerfil('O nome não pode estar vazio.');
            return;
        }
        localStorage.setItem('perfil_nome', form.nome);
        localStorage.setItem('perfil_telefone', form.telefone);
        localStorage.setItem('perfil_foto', form.foto);
        setSucesso('Dados pessoais atualizados com sucesso!');
        setTimeout(() => setSucesso(''), 3000);
    };

    const handleSalvarEndereco = () => {
        localStorage.setItem('perfil_cep', form.cep);
        localStorage.setItem('perfil_rua', form.rua);
        localStorage.setItem('perfil_numero', form.numero);
        localStorage.setItem('perfil_bairro', form.bairro);
        localStorage.setItem('perfil_cidade', form.cidade);
        localStorage.setItem('perfil_estado', form.estado);
        setEditandoEndereco(false);
        setSucesso('Endereço atualizado com sucesso!');
        setTimeout(() => setSucesso(''), 3000);
    };

    const handleSalvarSenha = (e) => {
        e.preventDefault();
        setErroSenha('');
        setSucesso('');
        if (!senhaForm.senhaAtual) {
            setErroSenha('Informe sua senha atual.');
            return;
        }
        if (senhaForm.novaSenha.length < 6) {
            setErroSenha('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
            setErroSenha('As senhas não conferem.');
            return;
        }
        setSucesso('Senha alterada com sucesso!');
        setSenhaForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        setTimeout(() => setSucesso(''), 3000);
    };

    const iniciais = form.nome
        ? form.nome.trim().split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : form.email?.[0]?.toUpperCase() || 'U';

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                        title="Voltar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
                        <p className="text-xs text-gray-400">Gerencie seus dados pessoais e endereço</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        {form.foto ? (
                            <img
                                src={form.foto}
                                alt="Foto de perfil"
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-md">
                                <span className="text-white text-3xl font-bold">{iniciais}</span>
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 border-2 border-white shadow">
                            <Camera size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="mt-3 w-full max-w-sm">
                        <input
                            type="url"
                            name="foto"
                            value={form.foto}
                            onChange={handleChange}
                            placeholder="URL da sua foto de perfil (opcional)"
                            className="w-full text-xs text-center border border-gray-200 rounded-full py-1.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-600 placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* Abas */}
                <div className="flex bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
                    <button
                        onClick={() => setAbaAtiva('dados')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${abaAtiva === 'dados' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <User size={14} className="inline mr-1.5" />
                        Dados Pessoais
                    </button>
                    <button
                        onClick={() => setAbaAtiva('senha')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${abaAtiva === 'senha' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Lock size={14} className="inline mr-1.5" />
                        Alterar Senha
                    </button>
                </div>

                {/* Mensagem de sucesso */}
                {sucesso && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl px-4 py-3 mb-5">
                        <CheckCircle size={16} />
                        {sucesso}
                    </div>
                )}

                {/* ABA: DADOS PESSOAIS */}
                {abaAtiva === 'dados' && (
                    <div className="flex flex-col gap-5">

                        {/* Formulário de dados pessoais */}
                        <form onSubmit={handleSalvarPerfil} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                            {erroPerfil && (
                                <p className="text-sm text-red-600 font-medium">{erroPerfil}</p>
                            )}

                            {/* Nome */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <User size={12} className="inline mr-1" /> Nome Completo
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Seu nome completo"
                                    className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <Mail size={12} className="inline mr-1" /> E-mail
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    readOnly
                                    className="w-full border border-gray-100 rounded-xl py-2.5 px-4 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">O e-mail não pode ser alterado.</p>
                            </div>

                            {/* Telefone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    <Phone size={12} className="inline mr-1" /> Telefone / WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    name="telefone"
                                    value={form.telefone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
                            >
                                <Save size={16} />
                                Salvar Dados Pessoais
                            </button>
                        </form>

                        {/* ─── SEÇÃO DE ENDEREÇO DE ENTREGA ─── */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                            {/* Cabeçalho da seção */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Truck size={18} className="text-blue-500" />
                                    Endereço de Entrega
                                </h2>
                                {!editandoEndereco && (
                                    <button
                                        onClick={() => setEditandoEndereco(true)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <Pencil size={13} />
                                        {temEndereco ? 'Alterar Endereço' : 'Adicionar Endereço'}
                                    </button>
                                )}
                                {editandoEndereco && (
                                    <button
                                        onClick={() => setEditandoEndereco(false)}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <X size={13} />
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            {/* MODO VISUALIZAÇÃO — card no estilo do Checkout */}
                            {!editandoEndereco && (
                                temEndereco ? (
                                    <div className="p-4 border-2 border-blue-500 bg-blue-50/40 rounded-xl flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                            </div>
                                            <div className="flex flex-col text-left gap-0.5">
                                                <span className="text-xs font-bold text-gray-900">
                                                    {form.rua}{form.numero ? `, ${form.numero}` : ''}
                                                </span>
                                                {form.bairro && (
                                                    <span className="text-[11px] text-gray-500">{form.bairro}</span>
                                                )}
                                                <span className="text-[11px] text-gray-500">
                                                    {[form.cidade, form.estado].filter(Boolean).join(' - ')}
                                                    {form.cep ? ` • CEP: ${form.cep}` : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md shrink-0">Ativo</span>
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center">
                                        <MapPin size={28} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs text-gray-400">Nenhum endereço cadastrado ainda.</p>
                                        <p className="text-[10px] text-gray-300 mt-0.5">Clique em "Adicionar Endereço" para cadastrar.</p>
                                    </div>
                                )
                            )}

                            {/* MODO EDIÇÃO — formulário dos campos */}
                            {editandoEndereco && (
                                <div className="flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">CEP</label>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={form.cep}
                                                onChange={handleChange}
                                                placeholder="00000-000"
                                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Número</label>
                                            <input
                                                type="text"
                                                name="numero"
                                                value={form.numero}
                                                onChange={handleChange}
                                                placeholder="Ex: 123"
                                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Rua / Logradouro</label>
                                        <input
                                            type="text"
                                            name="rua"
                                            value={form.rua}
                                            onChange={handleChange}
                                            placeholder="Nome da rua, avenida..."
                                            className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Bairro</label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={form.bairro}
                                            onChange={handleChange}
                                            placeholder="Nome do bairro"
                                            className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Cidade</label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                value={form.cidade}
                                                onChange={handleChange}
                                                placeholder="Sua cidade"
                                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
                                            <select
                                                name="estado"
                                                value={form.estado}
                                                onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                                            >
                                                <option value="">UF</option>
                                                {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
                                                    <option key={uf} value={uf}>{uf}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSalvarEndereco}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm mt-1"
                                    >
                                        <Save size={16} />
                                        Salvar Endereço
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ABA: ALTERAR SENHA */}
                {abaAtiva === 'senha' && (
                    <form onSubmit={handleSalvarSenha} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                        {erroSenha && (
                            <p className="text-sm text-red-600 font-medium">{erroSenha}</p>
                        )}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                <Lock size={12} className="inline mr-1" /> Senha Atual
                            </label>
                            <input
                                type="password"
                                name="senhaAtual"
                                value={senhaForm.senhaAtual}
                                onChange={handleSenhaChange}
                                placeholder="••••••••"
                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nova Senha</label>
                            <input
                                type="password"
                                name="novaSenha"
                                value={senhaForm.novaSenha}
                                onChange={handleSenhaChange}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmar Nova Senha</label>
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={senhaForm.confirmarSenha}
                                onChange={handleSenhaChange}
                                placeholder="Repita a nova senha"
                                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-sm"
                        >
                            <Save size={16} />
                            Alterar Senha
                        </button>
                    </form>
                )}

            </div>
        </main>
    );
}
