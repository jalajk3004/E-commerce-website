import ProductCard from './ProductCard';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCarousel({ title, products, onProductClick }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="flex items-end justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth px-4 md:px-0"
            >
                {products.map((product) => (
                    <div key={product.id} className="w-[300px] md:w-[350px] flex-shrink-0">
                        <ProductCard
                            product={product}
                            onClick={onProductClick}
                        />
                    </div>
                ))}
            </div>

        </section>
    );
}
