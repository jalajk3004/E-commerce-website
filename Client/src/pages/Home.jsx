import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import ModalPreview from '../components/ModalPreview';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { findProducts } from '../api/productService';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await findProducts({ pageSize: 12 });
                setProducts(data.content || []);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <Hero />

            <div className="py-10">
                <ProductCarousel
                    title="The latest. Take a look at what's new, now."
                    products={products}
                    onProductClick={(p) => setSelectedProduct(p)}
                />
            </div>

            <div className="py-10 bg-white">
                <ProductCarousel
                    title="Best Sellers. Loved by everyone."
                    products={[...products].reverse()}
                    onProductClick={(p) => setSelectedProduct(p)}
                />
            </div>

            <ModalPreview
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
            />

            <Footer />
        </div>
    );
}


