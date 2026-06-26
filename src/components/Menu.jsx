import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getCategories } from '../services/categoryService';

const CATEGORIA_TODOS = { id: 'Todos', label: 'Todos os produtos' };

export function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [categorias, setCategorias] = useState([]);

    const categoriaAtiva = searchParams.get('categoria') || 'Todos';

    useEffect(() => {
        getCategories()
            .then(data => setCategorias(data))
            .catch(() => {
                
                setCategorias([
                    { id: '361bb008-4f45-487a-b1f0-0598911ab267', label: 'SmartPhone' },
                    { id: '70b56836-1866-4936-bb34-813a9685c54e', label: 'SmartWatch' },
                    { id: 'Acessory', label: 'Acessórios' },
                ]);
            });
    }, []);

    const handleFiltro = (id) => {
        if (location.pathname !== '/produtos') {
            navigate(id === 'Todos' ? '/produtos' : `/produtos?categoria=${id}`);
        } else {
            if (id === 'Todos') {
                searchParams.delete('categoria');
                setSearchParams(searchParams);
            } else {
                setSearchParams({ categoria: id });
            }
        }
    };

    const todasCategorias = [CATEGORIA_TODOS, ...categorias];

    return (
        <nav className="w-full bg-white border-b border-gray-100 sticky top-[73px] z-40 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1 w-full">
                    {todasCategorias.map((cat) => (
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

                </div>

            </div>

        </nav>

    );
}