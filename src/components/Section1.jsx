import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";



export default function Section1() {
  const [listaProdutos, setListaProdutos] = useState([]);

  useEffect(() => {
    const carregar = () => {
      getProducts()
        .then(data => {
          setListaProdutos(data || []);
        })
        .catch(err => {
          console.error("Erro ao carregar produtos na Seção 1:", err);
        });
    };
    carregar();
    window.addEventListener('storage', carregar);
    return () => window.removeEventListener('storage', carregar);
  }, []);

  
  const apiProdsReversed = [...listaProdutos].reverse();
  const produtosExibidos = apiProdsReversed.slice(0, 5);

  return (
    <section className="px-4 py-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-sm md:text-base font-medium border-b-3 border-blue-300 rounded-b-lg w-fit">
          Aproveite as melhores ofertas em{" "}
          <span className="text-blue-500 font-semibold">Smartphones</span>
        </h2>
        <div className="">
          <Link to='/produtos' className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors">
            View All <ChevronRight size={16} color="#3B82F6" />
          </Link>
        </div>
      </div>

      {produtosExibidos.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-400">Nenhum produto cadastrado no catálogo.</p>
          <p className="text-xs text-gray-400 mt-1">Adicione produtos através do painel do administrador.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-start gap-4 lg:gap-9">
          {produtosExibidos.map((produto, index) => (
            <Link
              key={produto.id}
              to={`/produto/${produto.id}`}
              className={`flex flex-col h-full group cursor-pointer ${index >= 2 ? "hidden lg:block" : ""} `}
            >
              <div className="w-full lg:w-[200px] h-full bg-gray-100 rounded-xl border-2 border-gray-200 group-hover:border-blue-400 group-hover:shadow-md flex flex-col items-center relative transition-all duration-300">

                {produto.desconto > 0 && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    {produto.desconto}% OFF
                  </span>
                )}

                <div className="p-3 w-24 h-32 flex items-center justify-center">
                  <img
                    src={produto.imagem || produto.image || "https://placehold.co/200x260?text=Sem+Foto"}
                    alt={produto.nome}
                    className="max-h-full max-w-full object-contain mb-3 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="bg-white w-full flex-1 p-3 flex flex-col justify-between gap-4 rounded-b-xl text-left">
                  <p className="text-xs text-start font-medium text-gray-800 mb-1 transition-colors group-hover:text-blue-500 line-clamp-2">
                    {produto.nome}
                  </p>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {produto.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}{" "}
                      {produto.precoOriginal > produto.precoAtual && (
                        <span className="text-xs text-gray-400 line-through font-normal">
                          {produto.precoOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      )}
                    </p>
                    {produto.precoOriginal > produto.precoAtual && (
                      <p className="text-xs text-start text-green-500 font-medium">
                        Economize {(produto.precoOriginal - produto.precoAtual).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}