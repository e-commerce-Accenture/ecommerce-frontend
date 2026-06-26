import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Loader2 } from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

export default function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listaProdutos, setListaProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const termoBusca = searchParams.get("busca") || "";
  const categoriaParam = searchParams.get("categoria") || "Todos";

  
  useEffect(() => {
    getCategories()
      .then(data => setCategorias(data))
      .catch(() => {
        setCategorias([
          { id: '361bb008-4f45-487a-b1f0-0598911ab267', name: 'SmartPhone', label: 'SmartPhone', keywords: ['samsung', 'apple', 'smartphone', 'mobile', 'phone'] },
          { id: '70b56836-1866-4936-bb34-813a9685c54e', name: 'SmartWatch', label: 'SmartWatch', keywords: ['watch', 'watcher', 'smartwatch'] },
          { id: 'Acessory', name: 'Acessory', label: 'Acessórios', keywords: ['acessorio', 'acessórios'] },
        ]);
      });
  }, []);

  useEffect(() => {
    const buscarProdutosDaApi = () => {
      setCarregando(true);
      getProducts()
        .then(prods => {
          setListaProdutos(prods);
          setErro("");
        })
        .catch(err => {
          console.error("Erro ao carregar produtos:", err);
          setErro("Não foi possível carregar os produtos. Tente novamente mais tarde.");
        })
        .finally(() => {
          setCarregando(false);
        });
    };

    buscarProdutosDaApi();
    window.addEventListener('storage', buscarProdutosDaApi);
    return () => window.removeEventListener('storage', buscarProdutosDaApi);
  }, []);

  const handleMudarFiltro = (catId) => {
    searchParams.delete("marca");
    if (catId === "Todos") {
      searchParams.delete("categoria");
    } else {
      searchParams.set("categoria", catId);
    }
    setSearchParams(searchParams);
  };

  const marcaParam = searchParams.get("marca") || "Todas";

  const categoriaAtual = categorias.find(c =>
    c.id === categoriaParam || c.name === categoriaParam
  );

  
  const marcasDisponiveis = ["Todas"];
  
  if (categoriaParam !== "Todos" && categoriaAtual) {
    const brandsSet = new Set(
      listaProdutos
        .filter(p => p.categoriaId === categoriaParam || p.categoria === categoriaParam || (categoriaAtual.keywords && categoriaAtual.keywords.some(kw => (p.categoria || "").toLowerCase().includes(kw))))
        .map(p => p.marca)
        .filter(Boolean)
    );
    marcasDisponiveis.push(...Array.from(brandsSet));
  }

  const produtosFiltrados = listaProdutos.filter((p) => {
    let correspondeCategoria = true;
    if (categoriaParam !== "Todos" && categoriaAtual) {
      correspondeCategoria = p.categoriaId === categoriaParam || p.categoria === categoriaParam || (categoriaAtual.keywords && categoriaAtual.keywords.some(kw => (p.categoria || "").toLowerCase().includes(kw)));
    }
    let correspondeMarca = true;
    if (marcaParam !== "Todas") {
      correspondeMarca = (p.marca || "").toLowerCase() === marcaParam.toLowerCase();
    }
    const correspondeBusca = !termoBusca || p.nome.toLowerCase().includes(termoBusca.toLowerCase());
    return correspondeCategoria && correspondeMarca && correspondeBusca;
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
            
            <button
              key="Todos"
              onClick={() => handleMudarFiltro("Todos")}
              className="text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer block w-full"
              style={{
                backgroundColor: categoriaParam === "Todos" ? "#eff6ff" : "transparent",
                color: categoriaParam === "Todos" ? "#2563eb" : "#4b5563"
              }}
            >
              Todos
            </button>
            
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleMudarFiltro(cat.id)}
                className="text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer block w-full"
                style={{
                  backgroundColor: categoriaParam === cat.id || categoriaParam === cat.name ? "#eff6ff" : "transparent",
                  color: categoriaParam === cat.id || categoriaParam === cat.name ? "#2563eb" : "#4b5563"
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          
          {marcasDisponiveis.length > 1 && (
            <div className="border-t border-gray-100 pt-3.5 mt-3.5">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Marcas</h4>
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 whitespace-nowrap no-scrollbar w-full">
                {marcasDisponiveis.map((marca) => {
                  const estaAtiva = (marca === "Todas" && !searchParams.get("marca")) || (searchParams.get("marca") === marca);
                  return (
                    <button
                      key={marca}
                      onClick={() => {
                        if (marca === "Todas") {
                          searchParams.delete("marca");
                        } else {
                          searchParams.set("marca", marca);
                        }
                        setSearchParams(searchParams);
                      }}
                      className="text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer block w-full"
                      style={{
                        backgroundColor: estaAtiva ? "#eff6ff" : "transparent",
                        color: estaAtiva ? "#2563eb" : "#4b5563"
                      }}
                    >
                      {marca}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 w-full box-border">
          {carregando ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-2xl w-full">
              <Loader2 className="animate-spin text-blue-500 mb-3" size={32} />
              <p className="text-sm font-bold text-gray-500">Carregando produtos da API...</p>
            </div>
          ) : erro ? (
            <div className="text-center py-16 bg-white border rounded-2xl border-gray-200 w-full px-4">
              <p className="text-sm font-bold text-red-500">{erro}</p>
            </div>
          ) : produtosFiltrados.length === 0 ? (
            <div className="text-center py-16 bg-white border rounded-2xl border-gray-200 w-full">
              <p className="text-sm font-bold text-gray-400">Nenhum produto encontrado para esta seleção.</p>
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
                        <span>{produto.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        {produto.precoOriginal > produto.precoAtual && (
                          <span className="text-[10px] text-gray-400 line-through font-normal">
                            {produto.precoOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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