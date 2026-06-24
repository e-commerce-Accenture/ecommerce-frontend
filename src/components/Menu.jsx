import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Menu() {
    const location = useLocation();
    
    // Função para ver qual aba está ativa com base na URL
    const isActived = (path) => location.pathname + location.search === path;

    const categories = [
        { label: 'Todos os produtos', path: '/produtos' },
        { label: 'Smartphones', path: '/produtos?categoria=Mobile' },
        { label: 'Watches', path: '/produtos?categoria=Watches' },
        { label: 'Acessórios', path: '/produtos?categoria=Accessories' },
        { label: 'Meus Pedidos', path: '/meus-pedidos' },
    ];

    return (
        <nav className="border-b border-gray-100 bg-white w-full">
            {/* O truque aqui é manter o overflow-x-auto e usar o scrollbar-hide */}
            <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide">
                {/* Mudança chave: justify-start no mobile para permitir o scroll por toque, e md:justify-center no desktop */}
                <ul className="flex items-center gap-6 md:gap-8 justify-start md:justify-center px-4 min-w-max md:min-w-0">
                    {categories.map((cat, index) => {
                        const active = isActived(cat.path) || 
                                       (cat.path === '/produtos' && location.pathname === '/produtos' && !location.search) ||
                                       (cat.path === '/meus-pedidos' && location.pathname === '/meus-pedidos');
                        return (
                            <li key={index} className="block">
                                <Link 
                                    to={cat.path}
                                    className={`py-4 text-sm font-bold whitespace-nowrap inline-block border-b-2 transition-colors ${
                                        active 
                                            ? 'border-blue-500 text-gray-900' 
                                            : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {cat.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}