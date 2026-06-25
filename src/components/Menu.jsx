import React from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

export function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const categoriaAtiva = searchParams.get('categoria') || 'Todos';

    const categorias = [
        { id: 'Todos', label: 'Todos os produtos' },
        { id: 'Smartphones', label: 'Smartphones' },
        { id: 'Watches', label: 'Watches' },
        { id: 'Acessórios', label: 'Acessórios' }
    ];

    const handleFiltro = (id) => {
        if (location.pathname !== '/produtos') {
            if (id === 'Todos') {
                navigate('/produtos');
            } else {
                navigate(`/produtos?categoria=${id}`);
            }
        } else {
            if (id === 'Todos') {
                searchParams.delete('categoria');
                setSearchParams(searchParams);
            } else {
                setSearchParams({ categoria: id });
            }
        }
    };

    return (
        <nav className="w-full bg-white border-b border-gray-100 sticky top-[73px] z-40 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center">
                
                <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1 w-full">
                    {categorias.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleFiltro(cat.id)}
                            className={`text-xs font-semibold whitespace-nowrap transition-colors relative pb-1 cursor-pointer ${
                                categoriaAtiva === cat.id 
                                ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600' 
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}

                    <button 
                        onClick={() => navigate('/meus-pedidos')}
                        className="text-xs font-bold text-gray-700 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer whitespace-nowrap ml-auto"
                    >
                        Meus Pedidos
                    </button>
                </div>
            </div>
        </nav>
    );
}