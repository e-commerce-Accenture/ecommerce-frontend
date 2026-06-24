import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Banner1 from "../assets/banner-promo/group-50.png";
import Banner2 from "../assets/banner-promo/group-51.png";
import Banner3 from "../assets/banner-promo/group-52.png";
import Banner4 from "../assets/banner-promo/group-53.png";
import Banner5 from "../assets/banner-promo/group-54.png";

const banners = [
  { id: 1, imagem: Banner1 },
  { id: 2, imagem: Banner2 },
  { id: 3, imagem: Banner3 },
  { id: 4, imagem: Banner4 },
  { id: 5, imagem: Banner5 },
];

export default function Section3() {
  const [ativo, setAtivo] = useState(0);

  // Calcula dinamicamente o slice seguro para que SEMPRE apareçam 3 itens na tela
  // Se o índice ativo for deixar faltar itens no final, fixamos o início para exibir os últimos 3
  const indiceInicialSeguro = Math.min(ativo, banners.length - 3);
  const bannersVisiveis = banners.slice(indiceInicialSeguro, indiceInicialSeguro + 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="text-base font-bold text-gray-900 relative">
          Principais{" "}
          <span className="text-blue-500">
            marcas de eletrônicos
          </span>
          {/* Linha de destaque azul embaixo do título idêntica ao padrão do Figma */}
          <span className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-blue-500 rounded-full"></span>
        </h2>
      </div>

      {/* Grid de Banners */}
      <div className="flex gap-4 items-center justify-between mt-2">
        {bannersVisiveis.map((banner) => (
          <div key={banner.id} className="w-1/3 transition-all duration-300">
            <a href="#" className="block w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow">
              <img
                src={banner.imagem}
                alt={`Banner promocional ${banner.id}`}
                // Mudança crucial: w-full e h-auto com object-contain impede distorções e cortes grotescos
                className="w-full h-auto object-contain block"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Paginação de Bolinhas (Dots) */}
      {/* Limitamos os botões para "Total de itens - 2" já que mostramos 3 por vez */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: banners.length - 2 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setAtivo(index)}
            aria-label={`Ir para o slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              ativo === index ? "bg-blue-500 w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}