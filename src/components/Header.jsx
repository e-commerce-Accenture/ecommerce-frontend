import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogOut, ShoppingBag, ShieldAlert, UserCog } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pega o termo que já possa estar na URL, senão começa vazio
    const [busca, setBusca] = useState(searchParams.get("busca") || "");
    const isLogged = !!localStorage.getItem('token');

    // Verifica se o usuário logado é o administrador global
    const isAdmin = localStorage.getItem('user_email') === 'admin@smartly.com';

    // Estado dinâmico para controlar o contador da bolinha vermelha
    const [badgeQtd, setBadgeQtd] = useState(0);

    // Efeito para sincronizar e escutar as alterações de quantidade do carrinho
    useEffect(() => {
        const atualizarContadorCarrinho = () => {
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            // Soma a propriedade quantidade de cada item dinamicamente
            const totalItens = carrinho.reduce((acc, item) => acc + (Number(item.quantidade) || 1), 0);
            setBadgeQtd(totalItens);
        };

        // Roda a verificação assim que o Header monta na tela
        atualizarContadorCarrinho();

        // Escuta atualizações vindas de outras páginas (como o clique de adicionar ou remover)
        window.addEventListener('storage', atualizarContadorCarrinho);
        return () => {
            window.removeEventListener('storage', atualizarContadorCarrinho);
        };
    }, []);

    // Função para deslogar o usuário limpando as credenciais locais
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    // Função que envia a busca ao apertar Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (busca.trim()) {
                navigate(`/produtos?busca=${encodeURIComponent(busca.trim())}`);
            } else {
                navigate('/produtos');
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-8">

                {/* LOGO */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="text-2xl font-black text-blue-500 tracking-tighter cursor-pointer">
                        <h1>Smartly</h1>
                    </Link>
                </div>

                {/* BARRA DE PESQUISA CENTRALIZADA */}
                <div className="flex-1 max-w-md mx-auto min-w-[140px] relative">
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full bg-gray-100 border-none rounded-full py-2 md:py-2.5 pl-4 pr-9 focus:ring-2 focus:ring-indigo-500 outline-none text-xs md:text-sm"
                    />
                    <Search
                        size={16}
                        className="absolute right-3 top-2.5 md:top-3 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors"
                        onClick={() => navigate(busca.trim() ? `/produtos?busca=${encodeURIComponent(busca.trim())}` : '/produtos')}
                    />
                </div>

                {/* AÇÕES */}
                <div className="flex items-center gap-1 md:gap-4 shrink-0">

                    {/* Botão de Acesso ao Painel Admin (Apenas Visível para o Admin) */}
                    {isLogged && isAdmin && (
                        <Link to="/admin" className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-full transition-colors mr-1" title="Painel de Controle Gerencial">
                            <ShieldAlert size={14} />
                            <span className="hidden md:inline">Painel Admin</span>
                        </Link>
                    )}

                    <Link to="/meus-pedidos" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Meus Pedidos">
                        <ShoppingBag size={20} className="md:w-6 md:h-6" />
                    </Link>

                    {/* Botão de Perfil que criei */}
                    {isLogged && (
                        <Link to="/perfil" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Meu Perfil">
                            <UserCog size={20} className="md:w-6 md:h-6" />
                        </Link>
                    )}

                    {/* REDIRECIONAMENTO DO CARRINHO COM BADGE REAL E TOTALIZADO */}
                    <Link to="/carrinho" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" title="Meu Carrinho">
                        <ShoppingCart size={20} className="text-gray-700 md:w-6 md:h-6" />
                        {badgeQtd > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white">
                                {badgeQtd}
                            </span>
                        )}
                    </Link>

                    {isLogged ? (
                        <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-red-50 px-3 py-1.5 rounded-full" title="Sair">
                            <LogOut size={18} className="text-red-500" />
                            <span className="hidden lg:block text-sm font-bold text-red-600">Logout</span>
                        </button>
                    ) : (
                        <Link to="/cadastro" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Cadastrar / Entrar">
                            <User size={20} className="md:w-6 md:h-6" />
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}