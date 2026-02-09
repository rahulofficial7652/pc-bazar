
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/frontend/api-client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
        discountPrice?: number;
        images: string[];
        slug: string;
        stock: number;
    };
    quantity: number;
    _id: string; // The item ID in the array, usually created by mongoose subdocument
}

export function useCart() {
    const { data: session } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchCart = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const data = await apiClient<CartItem[]>('/api/v1/user/cart');
            if (data) {
                setCart(data);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [session]);

    const addToCart = async (productId: string, quantity: number = 1) => {
        if (!session) {
            toast.error("Please login to add to cart");
            router.push('/login'); // Redirect to login
            return;
        }

        const toastId = toast.loading("Adding to cart...");
        try {
            const res = await apiClient<CartItem[]>('/api/v1/user/cart', {
                method: 'POST',
                body: JSON.stringify({ productId, quantity })
            });

            if (res) {
                setCart(res);
                toast.success("Added to cart", { id: toastId });
            } else {
                toast.dismiss(toastId);
            }
        } catch (error) {
            toast.error("Failed to add to cart", { id: toastId });
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (!session) return;

        // Optimistic update
        const oldCart = [...cart];
        setCart(cart.map(item =>
            item.product._id === productId ? { ...item, quantity } : item
        ));

        try {
            // Check if removal
            if (quantity < 1) {
                await removeFromCart(productId); // Logic handled there
                return;
            }

            const res = await apiClient<CartItem[]>('/api/v1/user/cart', {
                method: 'PUT',
                body: JSON.stringify({ productId, quantity })
            });

            if (res) {
                setCart(res);
            } else {
                setCart(oldCart); // Revert
            }
        } catch (error) {
            setCart(oldCart); // Revert
            toast.error("Failed to update quantity");
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!session) return;

        const oldCart = [...cart];
        setCart(cart.filter(item => item.product._id !== productId));

        try {
            const res = await apiClient<CartItem[]>(`/api/v1/user/cart?productId=${productId}`, {
                method: 'DELETE'
            });

            if (res) {
                setCart(res);
                toast.success("Removed from cart");
            } else {
                setCart(oldCart);
            }
        } catch (error) {
            setCart(oldCart);
            toast.error("Failed to remove item");
        }
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => {
        const price = item.product.discountPrice || item.product.price;
        return acc + (price * item.quantity);
    }, 0);

    return {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        subtotal,
        refreshCart: fetchCart
    };
}
