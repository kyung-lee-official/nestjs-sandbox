import Image from "next/image";
import { getProductById } from "../api";
import { DisplayDate } from "./DisplayDate";
import { ProductImages } from "./ProductImages";
import { ProductOptions } from "./ProductOptions";
import { ProductVariants } from "./ProductVariants";

type PageProps = {
  params: Promise<{
    productId: string;
  }>;
};

const Page = async (props: PageProps) => {
  const { productId } = await props.params;
  const { product } = await getProductById(productId);

  return (
    <div className="container mx-auto px-4 py-8">
      <details className="mb-6">
        <summary className="mb-4 cursor-pointer text-blue-600 hover:underline">
          Raw Data (for debugging)
        </summary>
        <pre className="overflow-auto rounded-lg bg-gray-100 p-4 text-gray-800 text-sm">
          {JSON.stringify(product, null, 2)}
        </pre>
      </details>

      <div className="grid gap-6">
        {/* Product Header */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-bold text-3xl text-gray-800">
              {product.title}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 font-medium text-sm ${
                  product.status === "published"
                    ? "bg-green-100 text-green-800"
                    : product.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : product.status === "proposed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {product.status}
              </span>
              {product.discountable && (
                <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm">
                  Discountable
                </span>
              )}
              {product.is_giftcard && (
                <span className="rounded-full bg-yellow-100 px-3 py-1 font-medium text-sm text-yellow-800">
                  Gift Card
                </span>
              )}
            </div>
          </div>

          <p className="mb-4 text-gray-700">
            {product.description || "No description available."}
          </p>

          {product.subtitle && (
            <p className="mb-4 text-gray-600 italic">{product.subtitle}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.handle && (
              <div>
                <span className="font-medium text-gray-600">Handle:</span>{" "}
                <span className="text-gray-900">{product.handle}</span>
              </div>
            )}
            {product.material && (
              <div>
                <span className="font-medium text-gray-600">Material:</span>{" "}
                <span className="text-gray-900">{product.material}</span>
              </div>
            )}
            {product.weight && (
              <div>
                <span className="font-medium text-gray-600">Weight:</span>{" "}
                <span className="text-gray-900">{product.weight}g</span>
              </div>
            )}
            {product.length && (
              <div>
                <span className="font-medium text-gray-600">Length:</span>{" "}
                <span className="text-gray-900">{product.length}cm</span>
              </div>
            )}
            {product.width && (
              <div>
                <span className="font-medium text-gray-600">Width:</span>{" "}
                <span className="text-gray-900">{product.width}cm</span>
              </div>
            )}
            {product.height && (
              <div>
                <span className="font-medium text-gray-600">Height:</span>{" "}
                <span className="text-gray-900">{product.height}cm</span>
              </div>
            )}
            {product.origin_country && (
              <div>
                <span className="font-medium text-gray-600">
                  Origin Country:
                </span>{" "}
                <span className="text-gray-900">{product.origin_country}</span>
              </div>
            )}
            {product.hs_code && (
              <div>
                <span className="font-medium text-gray-600">HS Code:</span>{" "}
                <span className="text-gray-900">{product.hs_code}</span>
              </div>
            )}
            {product.mid_code && (
              <div>
                <span className="font-medium text-gray-600">MID Code:</span>{" "}
                <span className="text-gray-900">{product.mid_code}</span>
              </div>
            )}
            {product.external_id && (
              <div>
                <span className="font-medium text-gray-600">External ID:</span>{" "}
                <span className="text-gray-900">{product.external_id}</span>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-4 grid gap-2 border-gray-200 border-t pt-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {product.created_at && (
              <div>
                <span className="font-medium text-gray-600">Created:</span>{" "}
                <span className="text-gray-900">
                  <DisplayDate date={product.created_at} />
                </span>
              </div>
            )}
            {product.updated_at && (
              <div>
                <span className="font-medium text-gray-600">Updated:</span>{" "}
                <span className="text-gray-900">
                  <DisplayDate date={product.updated_at} />
                </span>
              </div>
            )}
            {product.deleted_at && (
              <div>
                <span className="font-medium text-gray-600">Deleted:</span>{" "}
                <span className="text-gray-900">
                  <DisplayDate date={product.deleted_at} />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Images */}
        <ProductImages product={product} />

        {/* Thumbnail */}
        {product.thumbnail && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Thumbnail</h2>
            <div className="w-48">
              <Image
                src={product.thumbnail}
                alt={`${product.title} thumbnail`}
                width={200}
                height={200}
                className="rounded-lg bg-gray-100 object-cover"
              />
            </div>
          </div>
        )}

        {/* Collection */}
        {product.collection && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Collection</h2>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">
                {product.collection.title}
              </h3>
              {product.collection.handle && (
                <p className="text-gray-600">
                  Handle: {product.collection.handle}
                </p>
              )}
              <p className="text-gray-600 text-sm">
                ID: {product.collection.id}
              </p>
              {product.collection.created_at && (
                <p className="text-gray-600 text-sm">
                  Created: <DisplayDate date={product.collection.created_at} />
                </p>
              )}
              {product.collection.metadata && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-gray-600">
                    Collection Metadata
                  </summary>
                  <pre className="mt-1 rounded bg-gray-50 p-2 text-xs">
                    {JSON.stringify(product.collection.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Categories</h2>
            <div className="space-y-3">
              {product.categories.map((category) => (
                <div key={category.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                      )}
                      {category.handle && (
                        <p className="text-gray-500 text-sm">
                          Handle: {category.handle}
                        </p>
                      )}
                    </div>
                    {category.rank !== null && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-800 text-xs">
                        Rank: {category.rank}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Type */}
        {product.type && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Product Type</h2>
            <div className="space-y-2">
              <p className="font-medium">{product.type.value}</p>
              <p className="text-gray-600 text-sm">ID: {product.type.id}</p>
              {product.type.created_at && (
                <p className="text-gray-600 text-sm">
                  Created: <DisplayDate date={product.type.created_at} />
                </p>
              )}
              {product.type.metadata && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-gray-600">
                    Type Metadata
                  </summary>
                  <pre className="mt-1 rounded bg-gray-50 p-2 text-xs">
                    {JSON.stringify(product.type.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <div key={tag.id} className="group relative">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800 text-sm">
                    {tag.value}
                  </span>
                  <div className="-translate-x-1/2 absolute bottom-full left-1/2 z-10 mb-2 hidden rounded bg-black px-2 py-1 text-white text-xs group-hover:block">
                    ID: {tag.id}
                    {tag.created_at && (
                      <>
                        <br />
                        Created: <DisplayDate date={tag.created_at} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Options */}
        <ProductOptions product={product} />

        {/* Product Variants */}
        <ProductVariants product={product} />

        {/* Product IDs */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 font-semibold text-xl">Product IDs</h2>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="font-medium text-gray-600">Product ID:</span>{" "}
              <span className="text-gray-900">{product.id}</span>
            </div>
            {product.collection_id && (
              <div>
                <span className="font-medium text-gray-600">
                  Collection ID:
                </span>{" "}
                <span className="text-gray-900">{product.collection_id}</span>
              </div>
            )}
            {product.type_id && (
              <div>
                <span className="font-medium text-gray-600">Type ID:</span>{" "}
                <span className="text-gray-900">{product.type_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Metadata */}
        {product.metadata && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Product Metadata</h2>
            <pre className="rounded bg-gray-50 p-4 text-gray-700 text-sm">
              {JSON.stringify(product.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
