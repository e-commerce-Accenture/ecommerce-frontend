import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Truck, ShoppingBag, ArrowLeft, ShieldCheck } from "lucide-react";
import { getProductById, updateProduct } from "../services/productService";
import { getToken } from "../services/tokenService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");

  useEffect(() => {
    
    const checkoutData = localStorage.getItem("checkout_atual");
    if (checkoutData) {
      const data = JSON.parse(checkoutData);
      setProduto(data.produto);
      setQuantidade(data.quantidade || 1);
    }

    
    const savedEmail = localStorage.getItem("user_email") || "";
    setEmail(savedEmail);

    const token = getToken();
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (payload.name) setNome(payload.name);
      } catch (e) {
        console.error("Erro ao decodificar nome do token no checkout:", e);
      }
    }

    
    const savedAddress = localStorage.getItem("user_address");
    if (savedAddress) {
      try {
        const addr = JSON.parse(savedAddress);
        if (addr.cep) setCep(addr.cep);
        
        
        const partes = [];
        if (addr.street) partes.push(addr.street);
        if (addr.number) partes.push(`nº ${addr.number}`);
        if (addr.neighborhood) partes.push(addr.neighborhood);
        if (addr.city && addr.state) {
          partes.push(`${addr.city}/${addr.state}`);
        } else {
          if (addr.city) partes.push(addr.city);
          if (addr.state) partes.push(addr.state);
        }
        
        if (partes.length > 0) {
          setEndereco(partes.join(" - "));
        }
      } catch (e) {
        console.error("Erro ao carregar endereço no checkout:", e);
      }
    }
  }, []);

  if (!produto) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-4">
        <p className="text-gray-500 text-sm">Nenhum produto selecionado para checkout.</p>
        <Link to="/produtos" className="text-xs bg-blue-500 text-white px-4 py-2 rounded-xl font-medium">
          Ver Produtos
        </Link>
      </div>
    );
  }

  const precoSeguro = Number(produto.precoAtual) || 0;
  const total = precoSeguro * quantidade;

  const handleFinalizarCompra = (e) => {
    e.preventDefault();
    if (!nome || !email || !cep || !endereco) {
      alert("Por favor, preencha todos os campos da simulação!");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      const numeroPedido = "ORD-" + Math.floor(100000 + Math.random() * 900000);

      
      const dadosPedido = {
        
        id: numeroPedido,
        produto: produto.nome,
        qtd: quantidade,
        total: total,
        data: new Date().toLocaleDateString('pt-BR'),
        
        idPedido: numeroPedido,
        produtoNome: produto.nome,
        produtoImagem: produto.imagem || "",
        quantidade: quantidade,
        clienteNome: nome,
        endereco: endereco,
        status: "Processando",
        dataPedido: new Date().toLocaleDateString('pt-BR'),
      };

      
      const historicoAntigo = JSON.parse(localStorage.getItem("historico_pedidos") || "[]");
      const novoHistorico = [dadosPedido, ...historicoAntigo];
      localStorage.setItem("historico_pedidos", JSON.stringify(novoHistorico));

      
      const vendasAntigas = JSON.parse(localStorage.getItem("historico_vendas") || "[]");
      const novasVendas = [dadosPedido, ...vendasAntigas];
      localStorage.setItem("historico_vendas", JSON.stringify(novasVendas));

      
      localStorage.setItem("ultimo_pedido", JSON.stringify(dadosPedido));

      
      (async () => {
        try {
          if (produto && produto.id) {
            
            const latest = await getProductById(produto.id);
            const novoEstoque = Math.max(0, (latest.estoque || 0) - quantidade);
            await updateProduct(produto.id, { estoque: novoEstoque });
          } else {
            
            const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
            for (const item of carrinho) {
              if (item.id) {
                const latest = await getProductById(item.id);
                const novoEstoque = Math.max(0, (latest.estoque || 0) - item.quantidade);
                await updateProduct(item.id, { estoque: novoEstoque });
              }
            }
          }
        } catch (err) {
          console.error("Erro ao atualizar estoque na API durante checkout:", err);
        }
      })();

      
      localStorage.removeItem("carrinho");
      localStorage.removeItem("checkout_atual");
      window.dispatchEvent(new Event("storage"));

      setCarregando(false);
      navigate("/meus-pedidos");
    }, 2000);
  };

  return (
    <main className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para o produto
      </button>

      <form onSubmit={handleFinalizarCompra} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-blue-500" /> 1. Dados de Entrega (Simulado)
            </h2>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600 text-left">Nome Completo</label>
                <input required type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" className="border border-gray-200 p-2.5 rounded-xl bg-gray-50 focus:outline-blue-500 text-left" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600 text-left">E-mail para Notificações</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" className="border border-gray-200 p-2.5 rounded-xl bg-gray-50 focus:outline-blue-500 text-left" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 col-span-1">
                  <label className="font-semibold text-gray-600 text-left">CEP</label>
                  <input required type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" className="border border-gray-200 p-2.5 rounded-xl bg-gray-50 focus:outline-blue-500 text-left" />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="font-semibold text-gray-600 text-left">Endereço Completo</label>
                  <input required type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, bairro e apto" className="border border-gray-200 p-2.5 rounded-xl bg-gray-50 focus:outline-blue-500 text-left" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={18} className="text-blue-500" /> 2. Forma de Pagamento
            </h2>
            <div className="p-4 border-2 border-blue-500 bg-blue-50/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900">Cartão de Crédito Fictício</span>
                  <span className="text-[10px] text-gray-500">Apenas para fins de demonstração do projeto</span>
                </div>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md">Ativo</span>
            </div>
            <p className="text-[11px] text-gray-400 text-left">Nota: Nenhum valor real será cobrado e nenhuma informação sensível de cartão será exigida neste ambiente de homologação e testes.</p>
          </div>
        </div>

        <div className="lg:col-span-5 border border-gray-200 rounded-2xl p-6 bg-gray-50 flex flex-col gap-4 sticky top-6">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={18} className="text-gray-700" /> Resumo do Pedido
          </h2>

          <div className="flex gap-3 bg-white p-3 border border-gray-100 rounded-xl">
            <div className="w-16 h-16 bg-gray-50 border rounded-lg p-1 flex items-center justify-center shrink-0">
              <img src={produto.imagem || ""} alt={produto.nome} className="max-h-full object-contain" />
            </div>
            <div className="flex flex-col justify-center text-left flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 truncate">{produto.nome}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Quantidade: {quantidade}</p>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-bold text-gray-900">{precoSeguro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-dashed border-gray-200">
              <span>Total da Compra</span>
              <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={`w-full text-white font-medium text-xs py-3 rounded-xl transition-all shadow-sm mt-2 ${
              carregando ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {carregando ? "Processando Pagamento..." : "Finalizar Compra Fictícia"}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-1">
            <ShieldCheck size={12} /> Prototipagem de interface — Sem transações reais
          </div>
        </div>
      </form>
    </main>
  );
}