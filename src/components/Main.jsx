import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';

import banner1 from '../assets/main-banner/banner1.png';
import banner2 from '../assets/main-banner/banner2.png';
import banner3 from '../assets/main-banner/banner3.png';

export function Main() {
    const [slideAtivo, setSlideAtivo] = useState(0);
    const [estaPausado, setEstaPausado] = useState(false);
    const [listaBanners, setListaBanners] = useState([banner1, banner2, banner3]);
    
    useEffect(() => {
        const synchBanners = () => {
            const salvos = JSON.parse(localStorage.getItem('banners_principais'));
            if (salvos && salvos.length > 0) {
                setListaBanners(salvos);
            } else {
                setListaBanners([banner1, banner2, banner3]);
            }
        };

        synchBanners();
        window.addEventListener('storage', synchBanners);
        return () => window.removeEventListener('storage', synchBanners);
    }, []);

    const totalSlides = listaBanners.length;
    const TEMPO_AUTOPLAY = 4000;

    useEffect(() => {
        if (estaPausado || totalSlides <= 1) return;
        const timer = setInterval(() => {
            setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, TEMPO_AUTOPLAY);
        return () => clearInterval(timer);
    }, [estaPausado, totalSlides]);

    return (
        <main className="flex-1 bg-white w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

                <section 
                    className="relative rounded-3xl overflow-hidden shadow-xl w-full bg-[#111625]"
                    onMouseEnter={() => setEstaPausado(true)}
                    onMouseLeave={() => setEstaPausado(false)}
                >
                    {totalSlides > 1 && (
                        <button 
                            onClick={() => setSlideAtivo(prev => (prev === 0 ? totalSlides - 1 : prev - 1))}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div className="w-full h-full flex items-center justify-center">
                        <img 
                            src={listaBanners[slideAtivo]} 
                            alt={`Banner promocional ${slideAtivo + 1}`} 
                            className="w-full h-auto max-h-[450px] object-cover block select-none"
                        />
                    </div>
                    
                    {totalSlides > 1 && (
                        <button 
                            onClick={() => setSlideAtivo(prev => (prev === totalSlides - 1 ? 0 : prev + 1))}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm z-20 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    {totalSlides > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {listaBanners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlideAtivo(i)}
                                    className={`transition-all duration-300 rounded-full ${slideAtivo === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <Section1 />
                <Section2 />
                <Section3 />

            </div>
        </main>
    );
}