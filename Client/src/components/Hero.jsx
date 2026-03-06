import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#000]">
            {/* High-Impact Background Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2670"
                    alt="Premium Fashion"
                    className="w-full h-full object-cover scale-105 animate-subtle-zoom"
                />
            </div>

            <div className="relative z-20 text-center px-6 md:px-12 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="inline-block text-[12px] uppercase tracking-[0.4em] font-medium text-white/80 mb-6 px-4 py-1.5 border border-white/20 rounded-full backdrop-blur-sm">
                        Winter 2026 Collection
                    </span>
                    <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
                        Design. <br />
                        Refined.
                    </h1>
                    <p className="text-lg md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience the fusion of high-performance fabrics and timeless silhouettes. Crafted for the modern aesthetic.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button
                            onClick={() => navigate('/shop')}
                            className="aura-button-primary !bg-white !text-black hover:!bg-gray-200 transition-all w-full sm:w-auto text-base py-4 px-10 shadow-xl shadow-white/20"
                        >
                            Shop Aura
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="aura-button-secondary bg-white/20 text-white backdrop-blur-md border border-white/40 hover:bg-white/30 w-full sm:w-auto text-base py-4 px-10 transition-all font-bold"
                        >
                            Explore Collections
                        </button>
                    </div>


                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
            </motion.div>
        </section>
    );
}

