// app/product/[id]/page.tsx
import { Product } from "@/models/product";
import { connectDB } from "@/lib/db";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  // Database se product fetch karein
  const product = await Product.findById(id).populate('category');

  if (!product) return <h1>Product Not Found</h1>;

  return (
    <div className="product-container">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p className="price">Rs. {product.price}</p>
      <p>{product.description}</p>
      <button>Buy Now</button>
    </div>
  );
}