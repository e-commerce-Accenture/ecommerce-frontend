import { useState, useEffect } from "react";
import { getBanners } from "../services/bannerService";

export default function Section3() {
  const [ativo, setAtivo] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const [listaBanners, setListaBanners] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const synchPromo = () => {
      getBanners()
        .then(data => {
          const finalBanners = (data.promo || [])
            .map((img, idx) => ({ id: idx + 1, imagem: img }))
            .filter(b => b.imagem);
          setListaBanners(finalBanners);
        })
        .catch(err => {
          console.error("Erro ao carregar banners promocionais:", err);
        })
        .finally(() => {
          setCarregando(false);
        });
    };
    synchPromo();
    window.addEventListener('storage', synchPromo);
    return () => window.removeEventListener('storage', synchPromo);
  }, []);

  const totalBanners = listaBanners.length;
  const visiveis = Math.min(totalBanners, isMobile ? 1 : 3);
  const totalSlides = totalBanners > 0 ? Math.max(1, totalBanners - visiveis + 1) : 0;
  const TEMPO_AUTOPLAY = 4000;

  useEffect(() => {
    if (estaPausado || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, TEMPO_AUTOPLAY);
    return () => clearInterval(timer);
  }, [estaPausado, totalSlides]);

  const indiceSeguro = Math.max(0, Math.min(ativo, totalBanners - visiveis));
  const bannersVisiveis = listaBanners.slice(indiceSeguro, indiceSeguro + visiveis);

  return (
    <section className="px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="text-base font-bold text-gray-900 relative">
          Principais <span className="text-blue-500">marcas de eletrônicos</span>
          <span className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-blue-500 rounded-full"></span>
        </h2>
      </div>

      {carregando ? (
        <div className="w-full flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      ) : totalBanners === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-sm font-semibold text-gray-400">Nenhuma marca de destaque cadastrada.</p>
          <p className="text-xs text-gray-400 mt-1">Configure campanhas no painel administrativo.</p>
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
            onMouseEnter={() => setEstaPausado(true)}
            onMouseLeave={() => setEstaPausado(false)}
          >
            {bannersVisiveis.map((banner) => (
              <div key={banner.id} className="w-full transition-all duration-300">
                <a 
                  href="#" 
                  className="block w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm"
                >
                  <img 
                    src={banner.imagem} 
                    alt="" 
                    className="w-full h-auto block select-none" 
                  />
                </a>
              </div>
            ))}
          </div>

          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setAtivo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${ativo === index ? "bg-blue-500 w-8" : "bg-gray-300 w-2"}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}