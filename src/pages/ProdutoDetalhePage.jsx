import { useState, useEffect } from "react";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingCart,
  ThumbsUp,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Imports de imagens para o mock de dados funcionar idêntico à listagem
import Cel from "../assets/produtos/image-1.png";
import Cel2 from "../assets/produtos/image-2.png";
import Cel3 from "../assets/produtos/image-3.png";
import Cel4 from "../assets/produtos/image-4.png";
import Cel5 from "../assets/produtos/image-5.png";

// Banco de dados simulado expandido para alimentar os filtros de semelhantes
const bancoDeProdutos = [
  {
    id: 1,
    nome: "Galaxy S22 Ultra 5G",
    marca: "Samsung",
    precoAtual: 32999,
    precoOriginal: 74999,
    desconto: 56,
    categoria: "Samsung",
    images: [Cel, Cel2, Cel3],
    descricao:
      "Explore novas possibilidades com o Galaxy S22 Ultra. Equipado com a lendária S Pen embutida, câmeras de nível profissional com Nightography e a eficiência absurda do processador Snapdragon de última geração.",
    especificacoes: {
      Marca: "Samsung",
      Modelo: "Galaxy S22 Ultra",
      "Memória Interna": "256 GB",
      "Memória RAM": "12 GB",
      Bateria: "5.000 mAh",
      Conectividade: "5G, Wi-Fi 6E, Bluetooth 5.2",
    },
  },
  {
    id: 2,
    nome: "Galaxy M13 4GB | 64GB",
    marca: "Samsung",
    precoAtual: 10499,
    precoOriginal: 14999,
    desconto: 56,
    categoria: "Samsung",
    images: [Cel2, Cel, Cel3],
    descricao:
      "O Galaxy M13 combina estilo contemporâneo com desempenho confiável para o seu dia a dia. Tela fluida e bateria de longa duração para você não parar nunca.",
    especificacoes: {
      Marca: "Samsung",
      "Memória Interna": "64 GB",
      "Memória RAM": "4 GB",
    },
  },
  {
    id: 3,
    nome: "iPhone 14 Pro Max",
    precoAtual: 69999,
    precoOriginal: 89999,
    desconto: 22,
    categoria: "Apple",
    images: [Cel3, Cel2, Cel],
    descricao:
      "iPhone 14 Pro Max. Capture detalhes inacreditáveis com uma câmera de 48 MP. Experimente o iPhone de um jeito totalmente novo com a Dynamic Island e a tela Sempre Ativa.",
    especificacoes: {
      Marca: "Apple",
      Modelo: "iPhone 14 Pro Max",
      "Memória Interna": "128 GB",
    },
  },
  {
    id: 4,
    nome: "Apple Watch Series 9",
    precoAtual: 31999,
    precoOriginal: 40999,
    desconto: 56,
    categoria: "Apple Watch",
    images: [Cel4, Cel5],
    descricao:
      "O Apple Watch Series 9 ajuda você a ficar mais conectado, ativo, saudável e seguro. Apresentando o gesto de toque duplo, uma maneira mágica de usar o Apple Watch.",
    especificacoes: { Marca: "Apple", Conectividade: "GPS", Tamanho: "45mm" },
  },
  {
    id: 5,
    nome: "Galaxy Watch 6 BT",
    precoAtual: 17999,
    precoOriginal: 24999,
    desconto: 28,
    categoria: "Samsung Watch",
    images: [Cel5, Cel4],
    descricao:
      "Monitore sua saúde de dia e de noite. O Galaxy Watch 6 traz um design elegante com uma tela maior, além de insights personalizados de sono e composição corporal.",
    especificacoes: {
      Marca: "Samsung",
      Tamanho: "44mm",
      Conectividade: "Bluetooth",
    },
  },
];

// Mock de Avaliações Fakes bem estruturado
const avaliacoesFakes = [
  {
    id: 1,
    usuario: "Carlos Henrique Silva",
    inicial: "CH",
    nota: 5,
    data: "14 de Maio de 2026",
    titulo: "Excelente custo-benefício e entrega rápida!",
    comentario:
      "Produto sensacional, chegou muito antes do prazo estipulado. A bateria dura o dia todo com uso moderado e a tela tem uma fluidez absurda. Recomendo demais!",
    util: 34,
  },
  {
    id: 2,
    usuario: "Mariana Souza Costa",
    inicial: "MS",
    nota: 4,
    data: "28 de Abril de 2026",
    titulo: "Muito bom, mas a caixa veio um pouco amassada",
    comentario:
      "O aparelho em si é impecável, design lindo e câmeras maravilhosas. Só tirei uma estrela porque a transportadora amassou um pouco o canto da caixa do produto, mas por dentro estava tudo perfeitamente protegido.",
    util: 12,
  },
];

export default function ProdutoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const produto =
    bancoDeProdutos.find((p) => p.id === Number(id)) || bancoDeProdutos[0];

  const [fotoAtiva, setFotoAtiva] = useState(produto.images?.[0] || Cel);
  const [quantidade, setQuantidade] = useState(1);

  // Efeito para resetar a foto principal sempre que o usuário mudar de produto
  useEffect(() => {
    if (produto && produto.images) {
      setFotoAtiva(produto.images[0]);
    }
  }, [id, produto]);

  // Filtra produtos semelhantes (Mesma categoria, ignorando o próprio produto atual)
  const produtosSemelhantes = bancoDeProdutos.filter(
    (p) => p.categoria === produto.categoria && p.id !== produto.id,
  );

  // FUNÇÃO DE ADICIONAR E SALVAR ITEM NO CARRINHO LOCALSTORAGE REAL
  const handleAdicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    // Verifica se esse item específico já está na lista
    const produtoExistenteIndex = carrinhoAtual.findIndex((item) => item.id === produto.id);

    if (produtoExistenteIndex !== -1) {
      // Se já existir, soma a nova quantidade
      carrinhoAtual[produtoExistenteIndex].quantidade += quantidade;
    } else {
      // Se não existir, monta a estrutura completa que a tela de Carrinho precisa usar
      carrinhoAtual.push({
        id: produto.id,
        nome: produto.nome,
        precoAtual: produto.precoAtual,
        precoOriginal: produto.precoOriginal,
        imagem: produto.images?.[0] || Cel,
        quantidade: quantidade
      });
    }

    // Salva o array atualizado no localStorage
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));

    // Dispara o evento global para o Header redesenhar a bolinha vermelha
    window.dispatchEvent(new Event("storage"));

    // Redireciona para o carrinho
    navigate("/carrinho");
  };

  return (
    <main className="bg-white min-h-screen text-gray-800">
      {/* Container responsável pelo alinhamento e espaçamento lateral do Figma */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-blue-500 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/produtos" className="hover:text-blue-500 transition-colors">
            Produtos
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium line-clamp-1">
            {produto.nome}
          </span>
        </div>

        {/* Grid de Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUNA 1: Galeria de Imagens */}
          <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-2 shrink-0">
              {produto.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setFotoAtiva(img)}
                  className={`w-16 h-20 border rounded-lg p-2 bg-gray-50 flex items-center justify-center transition-all ${
                    fotoAtiva === img
                      ? "border-blue-500 ring-2 ring-blue-500/10"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${index}`}
                    className="max-h-full object-contain"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-center min-h-[350px] md:min-h-[450px] relative">
              <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {produto.desconto}% OFF
              </span>
              <img
                src={fotoAtiva}
                alt={produto.nome}
                className="w-64 h-80 object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* COLUNA 2: Título e Detalhes Centrais */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                {produto.marca}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {produto.nome}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
                1.420 avaliações
              </span>
            </div>

            <hr className="border-gray-200" />

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 line-through">
                De: ${produto.precoOriginal.toLocaleString()}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${produto.precoAtual.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Economize $
                  {(produto.precoOriginal - produto.precoAtual).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Em até 10x sem juros no cartão de crédito.
              </p>
            </div>

            <hr className="border-gray-200" />

            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-sm text-gray-900">
                Sobre este item
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {produto.descricao}
              </p>
            </div>
          </div>

          {/* COLUNA 3: Caixa de Compra Lateral */}
          <div className="lg:col-span-3 p-5 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col gap-4 sticky top-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-gray-900">
                ${produto.precoAtual.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Check size={14} /> Em estoque
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border border-gray-300 rounded-lg p-2 bg-white">
              <span className="text-gray-500">Quantidade:</span>
              <select
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="font-semibold bg-transparent focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {/* VINCULADO À FUNÇÃO ADICIONAR AO CARRINHO */}
              <button 
                onClick={handleAdicionarAoCarrinho}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={14} /> Adicionar ao carrinho
              </button>
              
              <button
                onClick={() => {
                  localStorage.setItem(
                    "checkout_atual",
                    JSON.stringify({ produto, quantidade }),
                  );
                  navigate("/checkout");
                }}
                className="w-full bg-gray-900 hover:bg-black text-white font-medium text-xs py-3 rounded-xl transition-all shadow-sm"
              >
                Comprar agora
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-2 text-[11px] text-gray-600 border-t border-gray-200 mt-2">
              <div className="flex gap-2">
                <Truck size={14} className="text-gray-400 shrink-0" />
                <p>Frete Grátis disponível para a sua região.</p>
              </div>
              <div className="flex gap-2">
                <RotateCcw size={14} className="text-gray-400 shrink-0" />
                <p>Devolução grátis em até 7 dias após o recebimento.</p>
              </div>
              <div className="flex gap-2">
                <ShieldCheck size={14} className="text-gray-400 shrink-0" />
                <p>Garantia oficial do fabricante incluída.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Especificações Técnicas */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Especificações do Produto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 max-w-3xl">
            {Object.entries(produto.especificacoes || {}).map(
              ([chave, valor]) => (
                <div
                  key={chave}
                  className="flex border-b border-gray-100 py-2.5 text-xs"
                >
                  <span className="w-1/3 text-gray-400 font-medium">{chave}</span>
                  <span className="w-2/3 text-gray-800 font-semibold">
                    {valor}
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* SEÇÃO: PRODUTOS SEMELHANTES */}
        {produtosSemelhantes.length > 0 && (
          <section className="border-t border-gray-200 pt-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Produtos <span className="text-blue-500">Semelhantes</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Baseado no item que você está visualizando
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtosSemelhantes.map((item) => (
                <Link
                  to={`/produto/${item.id}`}
                  className="flex flex-col h-full group"
                  key={item.id}
                >
                  <div className="w-full h-full bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center relative overflow-hidden transition-all group-hover:shadow-md group-hover:border-blue-200">
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10">
                      {item.desconto}% OFF
                    </span>

                    <div className="p-4 flex-1 flex items-center justify-center">
                      <img
                        src={item.images?.[0]}
                        alt={item.nome}
                        className="w-20 h-28 object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-multiply"
                      />
                    </div>

                    <div className="bg-white w-full p-3 flex flex-col justify-between gap-3 border-t border-gray-100 rounded-b-xl">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1 text-left">
                        {item.nome}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-gray-900 text-left">
                          ${item.precoAtual.toLocaleString()}{" "}
                          <span className="text-[10px] text-gray-400 line-through font-normal">
                            ${item.precoOriginal.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEÇÃO: AVALIAÇÕES DE CLIENTES */}
        <section className="border-t border-gray-200 pt-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Avaliação dos Clientes
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Resumo Estatístico Lateral */}
            <div className="lg:col-span-4 bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold text-gray-900">4.8</span>
                <div className="flex flex-col">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    Média global de estrelas
                  </span>
                </div>
              </div>

              {/* Barras de Progresso Fakes */}
              <div className="flex flex-col gap-2 mt-2 text-xs text-gray-600">
                {[
                  { estrelas: "5 estrelas", porcentagem: "82%" },
                  { estrelas: "4 estrelas", porcentagem: "12%" },
                  { estrelas: "3 estrelas", porcentagem: "4%" },
                  { estrelas: "2 estrelas", porcentagem: "1%" },
                  { estrelas: "1 estrela", porcentagem: "1%" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-16 shrink-0">{item.estrelas}</span>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: item.porcentagem }}
                      ></div>
                    </div>
                    <span className="w-8 shrink-0 text-right font-medium text-gray-400">
                      {item.porcentagem}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listagem de Comentários */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {avaliacoesFakes.map((av) => (
                <div
                  key={av.id}
                  className="border-b border-gray-100 pb-5 last:border-0 flex flex-col gap-2.5"
                >
                  {/* Perfil e Nome */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center">
                      {av.inicial}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">
                        {av.usuario}
                      </span>
                      <span className="text-[10px] text-gray-400">{av.data}</span>
                    </div>
                  </div>

                  {/* Estrelas do Comentário */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < av.nota ? "currentColor" : "none"}
                          className={i >= av.nota ? "text-gray-300" : ""}
                        />
                      ))}
                    </div>
                    <h4 className="text-xs font-bold text-gray-900">
                      {av.titulo}
                    </h4>
                  </div>

                  {/* Texto da avaliação */}
                  <p className="text-xs text-gray-600 leading-relaxed text-left">
                    {av.comentario}
                  </p>

                  {/* Botão de feedback útil */}
                  <button className="flex items-center gap-1.5 self-start text-[10px] text-gray-400 hover:text-blue-500 font-medium border border-gray-200 hover:border-blue-200 bg-white px-2.5 py-1 rounded-md transition-colors mt-1">
                    <ThumbsUp size={11} />
                    <span>Útil ({av.util})</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}