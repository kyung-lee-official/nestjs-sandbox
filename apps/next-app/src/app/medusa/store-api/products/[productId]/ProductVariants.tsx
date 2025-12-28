import { StoreProduct } from "@medusajs/types";
import { Variant } from "./Variant";

interface ProductVariantsProps {
  product: StoreProduct;
}

export const ProductVariants = ({ product }: ProductVariantsProps) => {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 font-semibold text-xl">Variants</h2>
      <div className="space-y-6">
        {product.variants.map((variant) => (
          <Variant key={variant.id} variant={variant} />
        ))}
      </div>
    </div>
  );
};