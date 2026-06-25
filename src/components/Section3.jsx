import { useState, useEffect } from "react";
import Banner1 from "../assets/banner-promo/group-50.png";
import Banner2 from "../assets/banner-promo/group-51.png";
import Banner3 from "../assets/banner-promo/group-52.png";
import Banner4 from "../assets/banner-promo/group-53.png";
import Banner5 from "../assets/banner-promo/group-54.png";

const bannersDefault = [
  { id: 1, imagem: Banner1 },
  { id: 2, imagem: Banner2 },
  { id: 3, imagem: Banner3 },
  { id: 4, imagem: Banner4 },
  { id: 5, imagem: Banner5 },
];

export default function Section3() {
  const [ativo, setAtivo] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const [listaBanners, setListaBanners] = useState(bannersDefault);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const synchPromo = () => {
      const salvos = JSON.parse(localStorage.getItem('banners_promocionais'));
      if (salvos && salvos.length > 0) {
        setListaBanners(salvos);
      } else {
        setListaBanners(bannersDefault);
      }
    };
    synchPromo();
    window.addEventListener('storage', synchPromo);
    return () => window.removeEventListener('storage', synchPromo);
  }, []);

  const visiveis = isMobile ? 1 : 3;
  const totalSlides = listaBanners.length - (isMobile ? 0 : 2);
  const TEMPO_AUTOPLAY = 4000;

  useEffect(() => {
    if (estaPausado || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, TEMPO_AUTOPLAY);
    return () => clearInterval(timer);
  }, [estaPausado, totalSlides]);

  const indiceSeguro = Math.max(0, Math.min(ativo, listaBanners.length - visiveis));
  const bannersVisiveis = listaBanners.slice(indiceSeguro, indiceSeguro + visiveis);

  return (
    <section className="px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h2 className="text-base font-bold text-gray-900 relative">
          Principais <span className="text-blue-500">marcas de eletrônicos</span>
          <span className="absolute bottom-[-9px] left-0 right-0 h-[3px] bg-blue-500 rounded-full"></span>
        </h2>
      </div>

      <div
        className="flex gap-4 mt-2"
        onMouseEnter={() => setEstaPausado(true)}
        onMouseLeave={() => setEstaPausado(false)}
      >
        {bannersVisiveis.map((banner) => (
          <div key={banner.id} className="flex-1 transition-all duration-300">
            <a href="#" className="block w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100 hover:shadow-sm">
              <img src={banner.imagem} alt="" className="w-full h-auto object-contain block" />
            </a>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setAtivo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${ativo === index ? "bg-blue-500 w-8" : "bg-gray-300 w-2"}`}
          />
        ))}
      </div>
    </section>
  );
}