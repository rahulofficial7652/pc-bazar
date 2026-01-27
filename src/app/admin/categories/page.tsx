"use client";

import { useEffect, useState, useCallback } from "react";
import { CategoryList } from "@/components/admin/categories/CategoryList";
import { CreateCategorySheet } from "@/components/admin/categories/CreateCategorySheet";
import { apiClient } from "@/lib/frontend/api-client";
import { Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    // We want ALL categories for admin, but the public endpoint standardly filters isActive.
    // However, the rule was "Deleted categories must NOT appear on client UI".
    // For Admin UI, we usually want to perform soft delete, so showing only active is fine for "Basic".
    // Or we might want to see deleted ones? The prompt says "Deleted categories/products must NOT appear on client UI".
    // It doesn't explicitly strict it for Admin, but "Admin panel for Category management" implies managing active ones usually in basic apps.
    // I will use same endpoint effectively.
    setLoading(true);
    const data = await apiClient<any[]>("/api/v1/categories");
    if (data) {
      setCategories(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
           <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <CreateCategorySheet onSuccess={fetchCategories} />
      </div>

      {loading ? (
        <div className="flex justify-center h-24 items-center">
            <Loader2 className="animate-spin" />
        </div>
      ) : (
        <CategoryList categories={categories} onRefresh={fetchCategories} />
      )}
    </div>
  );
}
