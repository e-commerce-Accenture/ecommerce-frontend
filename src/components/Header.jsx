import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, LogOut, ShoppingBag, ShieldAlert, UserCog } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getCart, isLoggedIn } from '../services/cartService';
import { getToken, removeToken } from '../services/tokenService';

export function Header() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [busca, setBusca] = useState(searchParams.get("busca") || "");

    
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    
    const [badgeQtd, setBadgeQtd] = useState(0);

    useEffect(() => {
        const verificarAuth = () => {
            const token = getToken();
            const role = localStorage.getItem('user_role');
            setIsLogged(!!token);
            setIsAdmin(role === 'admin');
        };

        const atualizarContadorCarrinho = async () => {
            try {
                if (isLoggedIn()) {
                    
                    const items = await getCart();
                    const total = (Array.isArray(items) ? items : []).reduce(
                        (acc, i) => acc + (Number(i.quantity) || Number(i.quantidade) || 1), 0
                    );
                    setBadgeQtd(total);
                } else {
                    
                    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                    const total = carrinho.reduce((acc, i) => acc + (Number(i.quantidade) || 1), 0);
                    setBadgeQtd(total);
                }
            } catch {
                const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                setBadgeQtd(carrinho.reduce((acc, i) => acc + (Number(i.quantidade) || 1), 0));
            }
        };

        verificarAuth();
        atualizarContadorCarrinho();

        const handleAuthChange = () => {
            verificarAuth();
            atualizarContadorCarrinho();
        };

        window.addEventListener('authChange', handleAuthChange);
        window.addEventListener('cartChange', atualizarContadorCarrinho);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
            window.removeEventListener('cartChange', atualizarContadorCarrinho);
        };
    }, []);

    const handleLogout = () => {
        removeToken();
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        window.dispatchEvent(new CustomEvent('authChange'));
        navigate('/login');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (busca.trim()) {
                navigate(`/produtos?busca=${encodeURIComponent(busca.trim())}`);
            } else {
                navigate('/produtos');
            }
        }
    };

    const acoes = (
        <>
            
            {isLogged && isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-full transition-colors" title="Painel de Controle Gerencial">
                    <ShieldAlert size={14} />
                    <span className="hidden lg:inline">Painel Admin</span>
                </Link>
            )}

            <Link to="/meus-pedidos" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Meus Pedidos">
                <ShoppingBag size={20} className="md:w-6 md:h-6" />
            </Link>

            
            {isLogged && (
                <Link to="/perfil" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Meu Perfil">
                    <UserCog size={20} className="md:w-6 md:h-6" />
                </Link>
            )}

            
            <Link to="/carrinho" className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Meu Carrinho">
                <ShoppingCart size={20} className="text-gray-700 md:w-6 md:h-6" />
                {badgeQtd > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white">
                        {badgeQtd}
                    </span>
                )}
            </Link>

            {isLogged ? (
                <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-red-50 px-2.5 py-1.5 rounded-full cursor-pointer" title="Sair">
                    <LogOut size={16} className="text-red-500" />
                    <span className="hidden lg:block text-xs font-bold text-red-600">Logout</span>
                </button>
            ) : (
                <Link to="/cadastro" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Cadastrar / Entrar">
                    <User size={20} className="md:w-6 md:h-6" />
                </Link>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:items-center justify-between gap-3 md:gap-8">

                
                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                    
                    <div className="flex items-center shrink-0">
                        <Link to="/" className="text-2xl font-black text-blue-500 tracking-tighter cursor-pointer">
                            <h1>Smartly</h1>
                        </Link>
                    </div>

                    
                    <div className="flex md:hidden items-center gap-1 shrink-0">
                        {acoes}
                    </div>
                </div>

                
                <div className="w-full md:w-[320px] lg:w-[448px] md:justify-self-center relative">
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

                
                <div className="hidden md:flex justify-end items-center gap-2 lg:gap-4 shrink-0">
                    {acoes}
                </div>

            </div>
        </header>
    );
}