
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/frontend/api-client";
import { Category } from "@/types";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await apiClient<any>("/api/v1/categories");
                const categoriesData = response?.data || response;
                if (categoriesData && Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
