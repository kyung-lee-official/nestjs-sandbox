import Image from "next/image";
import Link from "next/link";
import { getProduts } from "./api";

const Page = async () => {
  try {
    const { products } = await getProduts();
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 font-bold text-3xl text-gray-800">Products</h1>

        {/* Grid layout for product cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            // Get the first variant's calculated price if available
            const price = product.variants?.[0]?.calculated_price;
            const amount = price?.calculated_amount;
            const currencyCode = price?.currency_code || "USD";

            // Get thumbnail or first image
            const imageUrl = product.thumbnail || product.images?.[0]?.url;

            return (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="relative h-48 w-full bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      width={300}
                      height={200}
                      className="max-h-48 object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`rounded-full px-2 py-1 font-semibold text-xs ${
                        product.status === "published"
                          ? "bg-green-100 text-green-800"
                          : product.status === "draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="mb-2 line-clamp-1 font-semibold text-gray-800 text-lg">
                    {product.title}
                  </h3>

                  {product.subtitle && (
                    <p className="mb-2 line-clamp-1 text-gray-600 text-sm">
                      {product.subtitle}
                    </p>
                  )}

                  {product.description && (
                    <p className="mb-3 line-clamp-2 text-gray-500 text-sm">
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between">
                    {amount !== undefined && amount !== null ? (
                      <div className="font-bold text-gray-900 text-xl">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: currencyCode,
                        }).format(amount / 100)}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Price not available
                      </div>
                    )}

                    <Link
                      href={`/medusa/store-api/products/${product.id}`}
                      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors duration-200 hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Additional info */}
                  <div className="mt-4 flex justify-between border-gray-100 border-t pt-4 text-gray-500 text-xs">
                    <span>ID: {product.id} </span>
                    {product.variants && (
                      <span>{product.variants.length} variant(s)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl text-gray-400">🛒</div>
            <h3 className="mb-2 font-semibold text-gray-600 text-xl">
              No products found
            </h3>
            <p className="text-gray-500">
              There are no products available at the moment.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <div className="mb-4 text-4xl text-red-500">⚠️</div>
          <h2 className="mb-2 font-semibold text-red-700 text-xl">
            Error loading products
          </h2>
          <p className="text-red-600">
            There was a problem loading the products. Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default Page;
