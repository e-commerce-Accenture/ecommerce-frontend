import { useState, useEffect } from "react";
import { ChevronRight, Star, ShoppingCart, ThumbsUp, XCircle, Loader2 } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart, isLoggedIn } from "../services/cartService";

export default function ProdutoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarProduto = () => {
      setCarregando(true);
      getProductById(id)
        .then((prod) => {
          setProduto(prod);
          setImagemAtiva(prod.imagem || ImgGalaxyS22);
          setErro("");
        })
        .catch((err) => {
          console.error("Erro ao carregar produto:", err);
          setErro("Produto não encontrado ou erro de conexão.");
          setProduto(null);
        })
        .finally(() => {
          setCarregando(false);
        });
    };

    carregarProduto();
    window.addEventListener('storage', carregarProduto);
    return () => window.removeEventListener('storage', carregarProduto);
  }, [id]);

  const [adicionando, setAdicionando] = useState(false);

  
  const handleAdicionarAoCarrinho = async () => {
    if (!produto || produto.estoque <= 0) return;
    setAdicionando(true);
    try {
      await addToCart(produto.id, Number(quantidade));

      
      if (!isLoggedIn()) {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        const item = cart.find(i => i.id === produto.id);
        if (item) {
          item.nome = produto.nome || 'Produto';
          item.precoAtual = Number(produto.precoAtual) || 0;
          item.precoOriginal = Number(produto.precoOriginal) || Number(produto.precoAtual) || 0;
          item.imagem = produto.imagem || '';
          localStorage.setItem('carrinho', JSON.stringify(cart));
        }
      }

      setTimeout(() => window.dispatchEvent(new CustomEvent('cartChange')), 10);
      navigate('/carrinho');
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      alert('Não foi possível adicionar ao carrinho. Tente novamente.');
    } finally {
      setAdicionando(false);
    }
  };

  
  const handleComprarAgora = () => {
    if (!produto || produto.estoque <= 0) return;

    const dadosCheckout = {
      produto: {
        id: produto.id,
        nome: produto.nome || "Produto",
        precoAtual: Number(produto.precoAtual) || 0,
        precoOriginal: Number(produto.precoOriginal) || Number(produto.precoAtual) || 0,
        imagem: produto.imagem || ""
      },
      quantidade: Number(quantidade)
    };

    localStorage.setItem("checkout_atual", JSON.stringify(dadosCheckout));
    navigate("/checkout");
  };

  if (carregando) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 mb-3" size={40} />
        <h2 className="text-sm font-bold text-gray-500">Buscando detalhes do produto...</h2>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <XCircle size={48} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-900">{erro || "Produto indisponível"}</h2>
        <Link to="/produtos" className="mt-4 inline-block text-xs font-bold text-blue-500 hover:underline">Voltar à lista de produtos</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-sans text-gray-800 box-border w-full">
      
      
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap py-1">
        <Link to="/" className="hover:text-blue-500 font-medium">Home</Link>
        <ChevronRight size={12} className="shrink-0 text-gray-400" />
        <Link to="/produtos" className="hover:text-blue-500 font-medium">Produtos</Link>
        <ChevronRight size={12} className="shrink-0 text-gray-400" />
        <span className="text-gray-900 font-semibold truncate max-w-[180px]">{produto.nome}</span>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 text-left">
        
        
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-2 order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
            <button className="w-14 h-16 shrink-0 border rounded-xl p-1.5 flex items-center justify-center bg-white border-blue-500 ring-2 ring-blue-100">
              <img src={produto.imagem} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          </div>

          <div className="md:col-span-10 order-1 md:order-2 aspect-square bg-gray-50/50 rounded-2xl border border-gray-200 p-8 flex items-center justify-center relative overflow-hidden">
            {produto.desconto > 0 && (
              <span className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                {produto.desconto}% OFF
              </span>
            )}
            <img src={imagemAtiva} alt={produto.nome} className="max-h-[90%] max-w-[90%] object-contain" />
          </div>
        </div>

        
        <div className="lg:col-span-6 flex flex-col gap-5">
          <div>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {produto.marca || "Samsung"}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 tracking-tight leading-tight">
              {produto.nome}
            </h1>
            
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-xs text-blue-500 font-semibold hover:underline cursor-pointer">1.420 avaliações</span>
            </div>
          </div>

          
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              {Number(produto.precoOriginal) > Number(produto.precoAtual) && (
                <span className="text-xs text-gray-400 line-through font-medium">De: {Number(produto.precoOriginal || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-950">{Number(produto.precoAtual || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                {Number(produto.precoOriginal) > Number(produto.precoAtual) && (
                  <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                    Economize {(Number(produto.precoOriginal || 0) - Number(produto.precoAtual || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">ou em até 10x sem juros no cartão</span>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Estoque:</span>
                <span className={`font-bold ${produto.estoque > 0 ? "text-green-600" : "text-red-500"}`}>
                  {produto.estoque > 0 ? `${produto.estoque} un` : "Esgotado"}
                </span>
              </div>
              {produto.estoque > 0 && (
                <select 
                  value={quantidade} 
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                >
                  {[...Array(Math.min(10, produto.estoque))].map((_, i) => (
                    <option key={i+1} value={i+1}>Qtd: {i+1}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleAdicionarAoCarrinho}
              disabled={produto.estoque <= 0 || adicionando}
              className={`flex-1 font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all border cursor-pointer ${
                produto.estoque > 0 && !adicionando
                  ? "bg-white hover:bg-gray-50 text-gray-800 border-gray-300" 
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              {adicionando
                ? <><Loader2 size={14} className="animate-spin" /><span>Adicionando...</span></>
                : <><ShoppingCart size={14} /><span>Adicionar ao carrinho</span></>
              }
            </button>
            
            {produto.estoque > 0 && (
              <button 
                onClick={handleComprarAgora} 
                className="flex-1 bg-gray-950 hover:bg-black text-white font-bold text-xs py-3.5 rounded-xl transition-all text-center cursor-pointer"
              >
                Comprar agora
              </button>
            )}
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-black text-gray-900 mb-1.5 uppercase tracking-wider">Sobre este item</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {produto.descricao || "Explore novas possibilidades com o seu dispositivo avançado de última geração."}
            </p>
          </div>
        </div>

      </div>

      
      {produto.especificacoes && Object.keys(produto.especificacoes).length > 0 && (
        <section className="border-t border-gray-200 pt-8 mb-8 text-left">
          <h3 className="text-base font-black text-gray-900 mb-4">Especificações <span className="text-blue-500">Técnicas</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 max-w-4xl">
            {Object.entries(produto.especificacoes).map(([chave, valor], idx) => (
              <div key={idx} className="flex border-b border-gray-100 py-2 text-xs">
                <span className="w-1/3 text-gray-400 font-medium">{chave}</span>
                <span className="w-2/3 text-gray-900 font-bold">{valor}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      
      <section className="border-t border-gray-200 pt-8 mb-12 text-left">
        <h3 className="text-base font-black text-gray-900 mb-1">
          Produtos <span className="text-blue-500">Semelhantes</span>
        </h3>
        <p className="text-[11px] font-medium text-gray-400 mb-4">Baseado no item que você está visualizando</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-3 flex flex-col gap-2 max-w-[240px]">
            <div className="h-32 bg-gray-50/50 rounded-xl p-2 flex items-center justify-center relative">
              <span className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                56% OFF
              </span>
              <img src={produto.imagem || ImgGalaxyS22} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 line-clamp-1">Galaxy M13 4GB | 64GB</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-xs font-black text-gray-900">$10.499</p>
                <p className="text-[9px] text-gray-400 line-through">$14.999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="border-t border-gray-200 pt-8 text-left">
        <h3 className="text-base font-black text-gray-900 mb-6">Avaliação dos Clientes</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-gray-950">4.8</span>
              <div className="flex flex-col gap-0.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-medium text-gray-400">Média global de estrelas</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { estrelas: "5 estrelas", pct: "82%", largura: "w-[82%]" },
                { estrelas: "4 estrelas", pct: "12%", largura: "w-[12%]" },
                { estrelas: "3 estrelas", pct: "4%", largura: "w-[4%]" },
                { estrelas: "2 estrelas", pct: "1%", largura: "w-[1%]" },
                { estrelas: "1 estrela", pct: "1%", largura: "w-[1%]" },
              ].map((barra, bIdx) => (
                <div key={bIdx} className="flex items-center gap-3 text-xs font-medium">
                  <span className="w-16 text-gray-500 text-[11px]">{barra.estrelas}</span>
                  <div className="flex-1 h-2 bg-gray-200/70 rounded-full overflow-hidden">
                    <div className={`h-full bg-amber-500 ${barra.largura} rounded-full`}></div>
                  </div>
                  <span className="w-8 text-right text-gray-400 text-[11px]">{barra.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {[
              {
                id: 1, usuario: "Carlos Henrique Silva", inicial: "CH", data: "14 de Maio de 2026",
                titulo: "Excelente custo-benefício e entrega rápida!",
                comentario: "Produto sensacional, chegou muito antes do prazo estipulado. A bateria dura o dia todo com uso moderado e a tela tem uma fluidez absurda. Recomendo demais!", util: 34
              },
              {
                id: 2, usuario: "Mariana Souza Costa", inicial: "MS", data: "28 de Abril de 2026",
                titulo: "Muito bom, mas a caixa veio um pouco amassada",
                comentario: "O aparelho em si é impecável, design lindo e câmeras maravilhosas. Só tirei uma estrela porque a transportadora amassou um pouco o canto da caixa do produto, mas por dentro estava tudo perfeitamente protegido.", util: 12
              }
            ].map((av) => (
              <div key={av.id} className="border-b border-gray-100 pb-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-500 text-white font-bold text-xs rounded-full flex items-center justify-center">{av.inicial}</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">{av.usuario}</span>
                    <span className="text-[10px] text-gray-400">{av.data}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-gray-300"} />)}
                </div>
                <p className="text-xs font-bold text-gray-950">{av.titulo}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{av.comentario}</p>
                
                <button className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-[10px] font-bold text-gray-500 px-2.5 py-1 rounded-lg w-fit mt-1 cursor-pointer">
                  <ThumbsUp size={11} />
                  <span>Útil ({av.util})</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}