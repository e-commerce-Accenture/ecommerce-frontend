import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronRight, SlidersHorizontal, Search } from "lucide-react";

import ImgGalaxyS22 from "../assets/produtos/image-1.png"; 
import ImgGalaxyM13 from "../assets/produtos/image-2.png";
import ImgIphone14 from "../assets/produtos/image-3.png";   
import ImgAppleWatch from "../assets/produtos/image-4.png";  
import ImgGalaxyWatch from "../assets/produtos/image-5.png"; 

const produtos = [
  { id: 1, nome: "Galaxy S22 Ultra", precoAtual: 32999, precoOriginal: 74999, desconto: 56, imagem: ImgGalaxyS22, categoria: "Samsung" },
  { id: 2, nome: "Galaxy M13 4GB|64GB", precoAtual: 10499, precoOriginal: 14999, desconto: 56, imagem: ImgGalaxyM13, categoria: "Samsung" },
  { id: 3, nome: "iPhone 14 Pro Max", precoAtual: 69999, precoOriginal: 89999, desconto: 21, imagem: ImgIphone14, categoria: "Apple" },
  { id: 4, nome: "Apple Watch Series 8", precoAtual: 24999, precoOriginal: 39999, desconto: 37, imagem: ImgAppleWatch, categoria: "Watches" },
  { id: 5, nome: "Galaxy Watch 5 Pro", precoAtual: 19999, precoOriginal: 29999, desconto: 33, imagem: ImgGalaxyWatch, categoria: "Watches" }
];

export default function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaURL = searchParams.get("categoria");
  const buscaURL = searchParams.get("busca") || ""; // Captura o termo vindo do Header

  const [pesquisa, setPesquisa] = useState(buscaURL);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  // Sincroniza a pesquisa local se a busca mudar na URL
  useEffect(() => {
    setPesquisa(buscaURL);
  }, [buscaURL]);

  // Sincroniza a categoria da URL
  useEffect(() => {
    if (categoriaURL) {
      if (categoriaURL === "Mobile") {
        setCategoriaSelecionada("Smartphones All");
      } else {
        setCategoriaSelecionada(categoriaURL);
      }
    } else {
      setCategoriaSelecionada("Todos");
    }
  }, [categoriaURL]);

  // Lógica de Filtro Duplo: Filtra por texto digitado E pela categoria ao mesmo tempo
  const produtosFiltrados = produtos.filter((produto) => {
    const batePesquisa = produto.nome.toLowerCase().includes(pesquisa.toLowerCase());
    
    if (categoriaSelecionada === "Todos") return batePesquisa;
    if (categoriaSelecionada === "Smartphones All") {
      return batePesquisa && (produto.categoria === "Samsung" || produto.categoria === "Apple");
    }
    return batePesquisa && produto.categoria === categoriaSelecionada;
  });

  // Atualiza a URL dinamicamente quando digitar na página de produtos
  const handleInputPesquisa = (e) => {
    const valor = e.target.value;
    setPesquisa(valor);

    // Atualiza os Query Params sem perder o filtro de categoria existente
    const novosParams = new URLSearchParams(searchParams);
    if (valor.trim()) {
      novosParams.set("busca", valor);
    } else {
      novosParams.delete("busca");
    }
    setSearchParams(novosParams);
  };

  return (
    <main className="py-4 md:py-6 bg-white text-gray-800 font-sans w-full max-w-[1440px] mx-auto overflow-x-hidden px-6 md:px-16 box-border">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5 text-left pl-2">
        <Link to="/" className="hover:text-gray-600">Home</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Produtos</span>
      </div>

      {/* Grid Principal */}
      <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] gap-10 w-full pl-2">
        
        {/* SEÇÃO DE FILTROS */}
        <div className="flex flex-col gap-3 lg:gap-6 text-left w-full">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <SlidersHorizontal size={16} className="text-gray-900" />
            <h2 className="text-sm font-bold text-gray-900">Filtros Avançados</h2>
          </div>

          <div className="w-full overflow-hidden">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:mb-3">Categorias</h3>
            
            <ul className="flex flex-wrap lg:flex-col items-center lg:items-start gap-3 w-full">
              {[
                { label: "Todos os Produtos", value: "Todos", slug: null },
                { label: "Smartphones (Todos)", value: "Smartphones All", slug: "Mobile" },
                { label: "Apenas Samsung", value: "Samsung", slug: "Samsung" },
                { label: "Apenas Apple", value: "Apple", slug: "Apple" },
                { label: "Watches", value: "Watches", slug: "Watches" },
                { label: "Accessories", value: "Accessories", slug: "Accessories" }
              ].map((cat) => {
                const ativo = categoriaSelecionada === cat.value;
                return (
                  <li key={cat.value} className="shrink-0">
                    <button
                      onClick={() => {
                        setCategoriaSelecionada(cat.value);
                        const novosParams = new URLSearchParams(searchParams);
                        if (cat.slug) novosParams.set("categoria", cat.slug);
                        else novosParams.delete("categoria");
                        setSearchParams(novosParams);
                      }}
                      className={`text-xs md:text-sm font-medium transition-all px-3 py-1.5 rounded-full lg:p-0 lg:rounded-none whitespace-nowrap ${
                        ativo
                          ? "bg-blue-500 text-white lg:bg-transparent lg:text-blue-500 lg:font-bold"
                          : "bg-gray-100 text-gray-600 lg:bg-transparent lg:hover:text-gray-900"
                      }`}
                    >
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* VITRINE DE PRODUTOS */}
        <div className="flex flex-col gap-5 w-full min-w-0">
          
          {/* Barra de Busca */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Pesquisar nesta categoria..."
              value={pesquisa}
              onChange={handleInputPesquisa}
              className="w-full text-xs pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all box-border"
            />
            <Search size={16} className="absolute right-3 top-3.5 text-gray-400" />
          </div>

          {/* Listagem */}
          {produtosFiltrados.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-xs text-gray-500 font-medium">Nenhum produto encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 w-full min-w-0 box-border">
              {produtosFiltrados.map((produto) => (
                <Link
                  key={produto.id}
                  to={`/produto/${produto.id}`}
                  className="group flex flex-col bg-[#f3f4f7] rounded-xl overflow-hidden transition-all hover:shadow-md border border-transparent w-full min-w-0 box-border"
                >
                  <div className="w-full flex justify-start p-2">
                    <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      {produto.desconto}% OFF
                    </span>
                  </div>

                  <div className="h-28 sm:h-40 w-full flex items-center justify-center p-2 mix-blend-multiply bg-transparent">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <div className="bg-white w-full p-2.5 flex flex-col flex-1 justify-between gap-1.5 border-t border-gray-100 rounded-b-xl text-left box-border">
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2rem]">
                      {produto.nome}
                    </p>
                    
                    <div className="flex flex-col gap-0.5 mt-auto">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 flex flex-wrap items-baseline gap-1">
                        <span>${produto.precoAtual.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 line-through font-normal">
                          ${produto.precoOriginal.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-[9px] text-green-600 font-bold">
                        Poupa ${ (produto.precoOriginal - produto.precoAtual).toLocaleString() }
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