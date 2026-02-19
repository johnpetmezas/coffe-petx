'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import CoffeeScroll from '@/components/CoffeeScroll';

interface TextBlockProps {
    children: React.ReactNode;
    range: [number, number];
    align?: 'left' | 'center' | 'right';
}

function TextBlock({ children, range, align = 'center' }: TextBlockProps) {
    const { scrollYProgress } = useScroll();

    // Fade in over first 10% of range, fade out over last 10%
    // range = [start, end]
    // visible range = [start + 0.1*(end-start), end - 0.1*(end-start)] roughly
    // The prompt says: [start, start + 0.1, end - 0.1, end] -> [0, 1, 1, 0]
    // But keyframes need to be absolute 0-1 values.
    // Actually, standard practice: map scrollYProgress to 0-1 for opacity directly?
    // Let's implement exact prompt logic:

    const [start, end] = range;
    const duration = end - start;
    const fadeInEnd = start + (duration * 0.1);
    const fadeOutStart = end - (duration * 0.1);

    const opacity = useTransform(
        scrollYProgress,
        [start, fadeInEnd, fadeOutStart, end],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [start, fadeInEnd, fadeOutStart, end],
        [20, 0, 0, -20]
    );

    return (
        <motion.div
            style={{ opacity, y }}
            className={`fixed inset-0 flex items-center px-12 pointer-events-none z-10 ${align === 'left' ? 'justify-start' :
                align === 'right' ? 'justify-end' :
                    'justify-center'
                }`}
        >
            <div className={`max-w-4xl ${align === 'right' ? 'text-right' : align === 'left' ? 'text-left' : 'text-center'}`}>
                {children}
            </div>
        </motion.div>
    );
}

export default function Home() {
    return (
        <main className="relative bg-[#050505] text-[#ECE0D1] selection:bg-[#D4A373] selection:text-[#050505]">
            {/* Premium Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold tracking-[0.3em] text-sm pointer-events-auto cursor-pointer"
                >
                    FUCK YOU COFFEE
                </motion.div>
                <div className="flex gap-8 pointer-events-auto">
                    {[
                        { label: 'COLLECTION', href: '#order' },
                        { label: 'STORY', href: '#story' },
                        { label: 'SUBSCRIPTION', href: '#footer' }
                    ].map((item) => (
                        <motion.a
                            key={item.label}
                            href={item.href}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ opacity: 0.5 }}
                            className="text-[10px] tracking-[0.4em] font-medium cursor-pointer"
                        >
                            {item.label}
                        </motion.a>
                    ))}
                </div>
            </nav>

            <div className="h-[800vh]">
                <CoffeeScroll />

                {/* BEAT A: 0-10% */}
                <TextBlock range={[0, 0.1]} align="center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-7xl md:text-[12rem] font-bold tracking-tighter mb-4 text-[#ECE0D1] opacity-90 leading-none"
                    >
                        THE ALCHEMY
                    </motion.h1>
                    <p className="text-xl md:text-3xl font-light text-[#A8A29E] tracking-[0.2em] uppercase">
                        Precision Meets Passion
                    </p>
                </TextBlock>

                {/* BEAT B: 15-25% */}
                <TextBlock range={[0.15, 0.25]} align="left">
                    <div id="story" className="scroll-mt-20">
                        <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-[#ECE0D1] opacity-90">
                            ORIGIN
                        </h2>
                        <p className="text-xl md:text-2xl text-[#A8A29E] tracking-tight max-w-xl font-light leading-relaxed">
                            Hand-picked at 1,800 meters. Sun-drenched beans, ethically sourced from the volcanic soils of Ethiopia.
                        </p>
                        <motion.a
                            href="https://example.com/story"
                            target="_blank"
                            whileHover={{ scale: 1.05, x: 10 }}
                            whileTap={{ scale: 0.95 }}
                            className="pointer-events-auto mt-8 flex items-center gap-4 text-[#D4A373] font-mono tracking-widest text-sm group"
                        >
                            EXPLORE STORY <span className="group-hover:translate-x-2 transition-transform">→</span>
                        </motion.a>
                    </div>
                </TextBlock>

                {/* BEAT C: 30-45% */}
                <TextBlock range={[0.3, 0.45]} align="right">
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-[#ECE0D1] opacity-90">
                        ROAST
                    </h2>
                    <p className="text-xl md:text-2xl text-[#A8A29E] tracking-tight max-w-xl ml-auto font-light leading-relaxed">
                        Roasted in small batches to a precise medium-light profile, preserving the delicate floral and citrus notes.
                    </p>
                </TextBlock>

                {/* BEAT D: 50-65% */}
                <TextBlock range={[0.5, 0.65]} align="left">
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-[#ECE0D1] opacity-90">
                        EXTRACTION
                    </h2>
                    <p className="text-xl md:text-2xl text-[#A8A29E] tracking-tight max-w-xl font-light leading-relaxed">
                        9 bars of pressure. 28 seconds of stillness. A stream of pure liquid velvet descends into the cup.
                    </p>
                </TextBlock>

                {/* BEAT E: 70-85% */}
                <TextBlock range={[0.7, 0.85]} align="right">
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-[#ECE0D1] opacity-90 text-[#D4A373]">
                        SENSORY
                    </h2>
                    <p className="text-xl md:text-2xl text-[#A8A29E] tracking-tight max-w-xl ml-auto font-light leading-relaxed">
                        Notes of jasmine, bergamot, and a honey-like sweetness that lingers long after the final sip.
                    </p>
                </TextBlock>

                {/* BEAT F: 90-100% */}
                <TextBlock range={[0.9, 1.0]} align="center">
                    <div id="order">
                        <motion.h2
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            className="text-8xl md:text-[14rem] font-bold tracking-tighter mb-12 text-[#ECE0D1] leading-none"
                        >
                            THE CUP
                        </motion.h2>
                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <motion.a
                                href="https://example.com/checkout"
                                target="_blank"
                                whileHover={{ scale: 1.1, backgroundColor: "#ECE0D1" }}
                                whileTap={{ scale: 0.9 }}
                                className="pointer-events-auto px-16 py-8 bg-[#D4A373] text-[#050505] font-black tracking-[0.3em] text-lg transition-colors duration-300"
                            >
                                ORDER NOW
                            </motion.a>
                            <motion.a
                                href="#footer"
                                whileHover={{ scale: 1.1, borderColor: "#D4A373", color: "#D4A373" }}
                                whileTap={{ scale: 0.9 }}
                                className="pointer-events-auto px-16 py-8 border-2 border-[#ECE0D1]/20 text-[#ECE0D1] font-bold tracking-[0.3em] text-lg transition-all duration-300"
                            >
                                WHAT'S NEXT?
                            </motion.a>
                        </div>
                    </div>
                </TextBlock>
            </div>

            {/* Footer / Final Section */}
            <footer id="footer" className="relative z-20 py-24 px-12 border-t border-[#ECE0D1]/5 bg-[#050505]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-4xl font-bold tracking-tighter mb-8">JOIN THE FUCK YOU COFFEE</h2>
                        <p className="text-[#A8A29E] max-w-sm mb-8 leading-relaxed">
                            Subscribe to receive exclusive access to our rarest micro-lots and experimental roasts.
                        </p>
                        <div className="flex gap-4">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent border-b border-[#ECE0D1]/20 py-3 flex-1 focus:border-[#D4A373] outline-none transition-colors font-mono text-xs tracking-widest text-[#ECE0D1]"
                            />
                            <button className="text-[#D4A373] font-bold tracking-[0.2em] text-xs hover:text-[#ECE0D1] transition-colors">
                                JOIN
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[10px] tracking-[0.3em] text-[#D4A373] mb-8 font-bold">SOCIALS</h3>
                        <ul className="space-y-4 text-xs tracking-widest text-[#A8A29E]">
                            <li className="hover:text-[#ECE0D1] cursor-pointer transition-colors">INSTAGRAM</li>
                            <li className="hover:text-[#ECE0D1] cursor-pointer transition-colors">TWITTER</li>
                            <li className="hover:text-[#ECE0D1] cursor-pointer transition-colors">FACEBOOK</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] tracking-[0.3em] text-[#D4A373] mb-8 font-bold">CONTACT</h3>
                        <ul className="space-y-4 text-xs tracking-widest text-[#A8A29E]">
                            <li className="hover:text-[#ECE0D1] cursor-pointer transition-colors">ROASTERY@FUCKYOUCOFFEE.COM</li>
                            <li className="hover:text-[#ECE0D1] cursor-pointer transition-colors">+1 (234) 567-890</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-24 pt-12 border-t border-[#ECE0D1]/5 text-[#A8A29E]/30 text-[8px] tracking-[0.5em] text-center uppercase">
                    COPYRIGHT 2026 FUCK YOU COFFEE ROASTERS. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </main>
    );
}
