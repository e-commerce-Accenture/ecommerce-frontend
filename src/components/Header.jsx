import React, { useState } from 'react';
import { ShoppingCart, Search, User, LogOut, ShoppingBag } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const [busca, setBusca] = useState(searchParams.get("busca") || "");
    const isLogged = !!localStorage.getItem('token');
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
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

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-8">

                {/* LOGO */}
                <div className="flex items-center shrink-0">
                    <Link to="/" className="text-2xl font-black text-blue-500 tracking-tighter cursor-pointer">
                        <h1>Smartly</h1>
                    </Link>
                </div>

                {/* BARRA DE PESQUISA CENTRALIZADA E CORRIGIDA */}
                {/* mx-auto garante centralização no desktop | min-w-[140px] impede que fique micro no mobile */}
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
                    <Link to="/meus-pedidos" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700" title="Meus Pedidos">
                        <ShoppingBag size={20} className="md:w-6 md:h-6" />
                    </Link>

                    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ShoppingCart size={20} className="text-gray-700 md:w-6 md:h-6" />
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] md:text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white">
                            1
                        </span>
                    </button>

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