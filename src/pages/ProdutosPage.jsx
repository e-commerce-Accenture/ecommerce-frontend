import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

import ImgGalaxyS22 from "../assets/produtos/image-1.png"; 
import ImgGalaxyM13 from "../assets/produtos/image-2.png";
import ImgIphone14 from "../assets/produtos/image-3.png";   
import ImgAppleWatch from "../assets/produtos/image-4.png";  
import ImgGalaxyWatch from "../assets/produtos/image-5.png"; 

export default function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listaProdutos, setListaProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const termoBusca = searchParams.get("busca") || "";

  useEffect(() => {
    const catUrl = searchParams.get("categoria") || "Todos";
    const catLower = catUrl.toLowerCase();
    
    if (catLower.includes("mobile") || catLower.includes("smartphones") || catLower.includes("smart")) {
      setCategoriaAtiva("Smartphones");
    } else if (catLower.includes("watch") || catLower.includes("relogio") || catLower.includes("watches")) {
      setCategoriaAtiva("Watches");
    } else if (catLower.includes("acessorio") || catLower.includes("acessórios")) {
      setCategoriaAtiva("Acessórios");
    } else {
      setCategoriaAtiva("Todos");
    }
  }, [searchParams]);

  useEffect(() => {
    const carregarBancoGeral = () => {
      let banco = JSON.parse(localStorage.getItem('banco_produtos'));
      if (!banco || banco.length === 0) {
        banco = [
          { id: 1, nome: "Galaxy S22 Ultra", precoAtual: 32999, precoOriginal: 74999, desconto: 56, imagem: ImgGalaxyS22, categoria: "Samsung", estoque: 15, marca: "Samsung", descricao: "Explore novas possibilidades com o Galaxy S22 Ultra..." },
          { id: 2, nome: "Galaxy M13 4GB|64GB", precoAtual: 10499, precoOriginal: 14999, desconto: 56, imagem: ImgGalaxyM13, categoria: "Samsung", estoque: 8, marca: "Samsung", descricao: "O Galaxy M13 combina estilo contemporâneo..." },
          { id: 3, nome: "iPhone 14 Pro Max", precoAtual: 69999, precoOriginal: 89999, desconto: 21, imagem: ImgIphone14, categoria: "Apple", estoque: 23, marca: "Apple", descricao: "iPhone 14 Pro Max. Capture detalhes..." },
          { id: 4, nome: "Apple Watch Series 8", precoAtual: 24999, precoOriginal: 39999, desconto: 37, imagem: ImgAppleWatch, categoria: "Apple Watch", estoque: 4, marca: "Apple", descricao: "O Apple Watch Series ajuda você..." },
          { id: 5, nome: "Galaxy Watch 5 Pro", precoAtual: 19999, precoOriginal: 34999, desconto: 42, imagem: ImgGalaxyWatch, categoria: "Samsung Watch", estoque: 12, marca: "Samsung", descricao: "Monitore sua saúde de dia e de noite..." }
        ];
        localStorage.setItem('banco_produtos', JSON.stringify(banco));
      }
      setListaProdutos(banco);
    };

    carregarBancoGeral();
    window.addEventListener('storage', carregarBancoGeral);
    return () => window.removeEventListener('storage', carregarBancoGeral);
  }, []);

  const handleMudarFiltro = (novaCategoria) => {
    setCategoriaAtiva(novaCategoria);
    if (novaCategoria === "Todos") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", novaCategoria);
    }
    setSearchParams(searchParams);
  };

  const produtosFiltrados = listaProdutos.filter((p) => {
    let correspondeCategoria = true;
    const pCat = (p.categoria || "").toLowerCase();

    if (categoriaAtiva !== "Todos") {
      if (categoriaAtiva === "Smartphones") {
        correspondeCategoria = pCat === "samsung" || pCat === "apple" || pCat === "smartphones";
      } else if (categoriaAtiva === "Watches") {
        correspondeCategoria = pCat === "apple watch" || pCat === "samsung watch" || pCat.includes("watch") || pCat === "watches";
      } else if (categoriaAtiva === "Acessórios") {
        correspondeCategoria = pCat.includes("acessorio") || pCat.includes("acessórios");
      }
    }

    const correspondeBusca = !termoBusca || p.nome.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeCategoria && correspondeBusca;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-gray-800 font-sans box-border w-full">
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap py-1 text-left">
        <Link to="/" className="hover:text-blue-500 font-medium">Home</Link>
        <ChevronRight size={12} className="shrink-0 text-gray-400" />
        <span className="text-gray-900 font-semibold">Produtos</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start w-full box-border">
        <div className="w-full lg:w-56 shrink-0 bg-white border border-gray-200 rounded-2xl p-4 box-border">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-gray-500" /> Filtrar Por
            </h3>
          </div>
          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 whitespace-nowrap no-scrollbar w-full">
            {["Todos", "Smartphones", "Watches", "Acessórios"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleMudarFiltro(cat)}
                className="text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer block w-full"
                style={{
                  backgroundColor: categoriaAtiva === cat ? "#eff6ff" : "transparent",
                  color: categoriaAtiva === cat ? "#2563eb" : "#4b5563"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full box-border">
          {produtosFiltrados.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-2xl border-gray-200 w-full">
              <p className="text-sm font-bold text-gray-400">Nenhum produto encontrado para esta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full box-border">
              {produtosFiltrados.map((produto) => (
                <Link
                  to={`/produto/${produto.id}`}
                  key={produto.id}
                  className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 box-border overflow-hidden group hover:shadow-md transition-all"
                >
                  <div className="w-full h-40 sm:h-48 p-4 flex items-center justify-center bg-gray-50/50 relative shrink-0">
                    {produto.desconto > 0 && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10">
                        -{produto.desconto}%
                      </span>
                    )}
                    <img src={produto.imagem} alt={produto.nome} className="max-h-full max-w-full object-contain" />
                  </div>
                  
                  <div className="bg-white w-full p-2.5 flex flex-col flex-1 justify-between gap-1.5 border-t border-gray-100 rounded-b-xl text-left box-border">
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2rem]">
                      {produto.nome}
                    </p>
                    
                    <div className="flex flex-col gap-0.5 mt-auto">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 flex flex-wrap items-baseline gap-1">
                        <span>${produto.precoAtual.toLocaleString()}</span>
                        {produto.precoOriginal > produto.precoAtual && (
                          <span className="text-[10px] text-gray-400 line-through font-normal">
                            ${produto.precoOriginal.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}