import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Package, Truck, Home, ArrowRight, ShoppingBag } from "lucide-react";

export default function RastreioPage() {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const pedidoSalvo = localStorage.getItem("ultimo_pedido");
    if (pedidoSalvo) {
      setPedido(JSON.parse(pedidoSalvo));
    }
  }, []);

  if (!pedido) {
    return (
      <div className="py-16 text-center flex flex-col items-center gap-4">
        <p className="text-gray-500 text-sm">Nenhum pedido ativo para rastrear no momento.</p>
        <Link to="/produtos" className="text-xs bg-blue-500 text-white px-4 py-2 rounded-xl font-medium">
          Ir às Compras
        </Link>
      </div>
    );
  }

  
  const etapas = [
    { titulo: "Pedido Recebido", descricao: "Seu pagamento fictício foi aprovado com sucesso.", icon: CheckCircle2, concluido: true },
    { titulo: "Preparando Embalagem", descricao: "O produto está sendo separado no estoque de testes.", icon: Package, concluido: true },
    { titulo: "Em Trânsito", descricao: "A caminho do endereço fornecido na simulação.", icon: Truck, concluido: false },
    { titulo: "Entregue", descricao: "Objeto entregue ao destinatário final.", icon: Home, concluido: false },
  ];

  return (
    <main className="py-8 max-w-2xl mx-auto text-gray-800 flex flex-col gap-6">
      
      
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold">✓</div>
        <h1 className="text-lg font-bold text-green-900 mt-1">Compra Simulada com Sucesso!</h1>
        <p className="text-xs text-green-700">Seu pedido foi registrado no protótipo e já está na esteira logística fictícia.</p>
      </div>

      
      <div className="border border-gray-200 rounded-2xl p-5 bg-white flex flex-col gap-4">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100 text-xs">
          <div className="flex flex-col text-left">
            <span className="text-gray-400 font-medium">Código do Pedido</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{pedido.idPedido}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-400 font-medium">Data do Pedido</span>
            <span className="font-semibold text-gray-800">{pedido.dataPedido}</span>
          </div>
        </div>

        
        <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-white border rounded-lg p-1 flex items-center justify-center shrink-0">
            <img src={pedido.produtoImagem} alt={pedido.produtoNome} className="max-h-full object-contain" />
          </div>
          <div className="flex flex-col text-left flex-1 min-w-0">
            <h3 className="text-xs font-bold text-gray-900 truncate">{pedido.produtoNome}</h3>
            <p className="text-[10px] text-gray-400">Quantidade: {pedido.quantidade} • Total: {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
        </div>

        <div className="text-left text-xs bg-blue-50/30 border border-blue-100 p-3 rounded-xl">
          <span className="font-bold text-blue-900 block mb-0.5">Destino de Entrega:</span>
          <p className="text-blue-800 font-medium text-[11px]">{pedido.clienteNome} — {pedido.endereco}</p>
        </div>
      </div>

      
      <div className="border border-gray-200 rounded-2xl p-6 bg-white flex flex-col gap-5">
        <h2 className="text-sm font-bold text-gray-900 text-left">Status do Rastreamento</h2>

        <div className="relative flex flex-col gap-8 pl-6 border-l-2 border-gray-100 ml-3">
          {etapas.map((etapa, idx) => {
            const Icon = etapa.icon;
            return (
              <div key={idx} className="relative text-left flex gap-4 items-start group">
                
                <div className={`absolute -left-[33px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                  etapa.concluido ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200"
                }`}>
                  {etapa.concluido && <div className="w-1 h-1 rounded-full bg-white" />}
                </div>

                
                <div className={`p-2 rounded-xl border shrink-0 ${
                  etapa.concluido ? "bg-blue-50 border-blue-100 text-blue-500" : "bg-gray-50 border-gray-200 text-gray-400"
                }`}>
                  <Icon size={16} />
                </div>

                <div className="flex flex-col">
                  <h4 className={`text-xs font-bold ${etapa.concluido ? "text-gray-900" : "text-gray-400"}`}>
                    {etapa.titulo}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{etapa.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
      <div className="flex gap-3 justify-center mt-2">
        <Link to="/" className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors flex items-center gap-1.5">
          <ShoppingBag size={14} /> Voltar à Loja
        </Link>
        <button 
          onClick={() => {
            localStorage.removeItem("ultimo_pedido");
            navigate("/produtos");
          }} 
          className="text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1"
        >
          Simular Nova Compra <ArrowRight size={14} />
        </button>
      </div>

    </main>
  );
}