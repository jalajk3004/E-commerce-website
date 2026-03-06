import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onClick }) {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex-shrink-0 w-full bg-white rounded-[32px] p-6 shadow-sm hover:shadow-hover transition-all cursor-pointer group border border-gray-50"
            onClick={() => onClick ? onClick(product) : navigate(`/product/${product._id}`)}
        >
            <div className="aspect-[4/5] w-full mb-6 overflow-hidden rounded-[24px] bg-gray-50 flex items-center justify-center">
                <img
                    src={product.imageUrl || product.image}
                    alt={product.title || product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
            <div className="space-y-1">
                <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">{product.brand || 'Exclusive'}</p>
                <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight truncate">{product.title || product.name}</h3>
                <p className="text-sm text-secondary font-medium leading-relaxed line-clamp-2">{product.description}</p>
                <div className="pt-6 flex items-center justify-between">
                    <p className="text-lg font-bold">${product.discountedPrices || product.price}</p>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                        className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5"
                    >
                        View
                    </button>
                </div>
            </div>
        </motion.div>
    );
}



