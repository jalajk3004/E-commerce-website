import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addItemToCart, removeCartItem, updateCartItem } from '../api/cartService';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            setCartItems([]);
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const data = await getCart();
            setCart(data);
            setCartItems(data.cartItems || []);
        } catch (err) {
            console.error("Failed to fetch cart", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productData) => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            await addItemToCart({
                productId: productData.id || productData._id,
                size: productData.size,
                color: productData.color,
                quantity: 1
            });
            await fetchCart();
        } catch (err) {
            console.error("Failed to add to cart", err);
            alert("Error adding item to cart");
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            await fetchCart();
        } catch (err) {
            console.error("Failed to remove from cart", err);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await updateCartItem({
                cartItemId,
                data: { quantity }
            });
            await fetchCart();
        } catch (err) {
            console.error("Failed to update cart item", err);
        }
    };

    const cartTotal = cart?.totalDiscountedPrice || 0;
    const cartCount = cart?.totalItem || 0;

    return (
        <CartContext.Provider value={{
            cart,
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotal,
            cartCount,
            loading,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);

