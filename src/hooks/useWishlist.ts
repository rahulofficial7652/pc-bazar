
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/frontend/api-client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Product } from '@/types';

export function useWishlist() {
    const { data: session } = useSession();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        if (!session) return;
        setLoading(true);
        try {
            const data = await apiClient<Product[]>('/api/v1/user/wishlist');
            if (data) {
                setWishlist(data);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [session]);

    const addToWishlist = async (product: Product) => {
        if (!session) {
            toast.error("Please login to add to wishlist");
            return;
        }

        const oldWishlist = [...wishlist];
        // Optimistic add
        if (!wishlist.some(p => p._id === product._id)) {
            setWishlist([...wishlist, product]);
        }

        try {
            const res = await apiClient<Product[]>('/api/v1/user/wishlist', {
                method: 'POST',
                body: JSON.stringify({ productId: product._id })
            });

            if (res) {
                setWishlist(res);
                toast.success("Added to wishlist");
            } else {
                setWishlist(oldWishlist);
            }
        } catch (error) {
            setWishlist(oldWishlist);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!session) return;

        const oldWishlist = [...wishlist];
        setWishlist(wishlist.filter(item => item._id !== productId));

        try {
            const res = await apiClient<Product[]>(`/api/v1/user/wishlist?productId=${productId}`, {
                method: 'DELETE'
            }); // Note: API returns updated list

            if (res) {
                setWishlist(res);
                toast.success("Removed from wishlist");
            } else {
                setWishlist(oldWishlist);
            }
        } catch (error) {
            setWishlist(oldWishlist);
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: string) => wishlist.some(p => p._id === productId);

    return {
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
    };
}
