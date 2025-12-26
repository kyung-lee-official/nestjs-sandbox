import Image from "next/image";
import { getProductById } from "../api";
import { DisplayDate } from "./DisplayDate";

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
        <pre className="max-h-96 overflow-auto rounded-lg bg-gray-100 p-4 text-gray-800 text-sm">
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
        {product.images && product.images.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Images</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.images.map((image, index) => (
                <div key={image.id} className="space-y-2">
                  <div className="relative">
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      width={400}
                      height={300}
                      className="h-48 w-full rounded-lg bg-gray-100 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full bg-black bg-opacity-50 px-2 py-1 text-white text-xs">
                        Rank: {image.rank}
                      </span>
                    </div>
                  </div>

                  <div className="text-gray-600 text-sm">
                    <p>ID: {image.id}</p>
                    {image.created_at && (
                      <p>
                        Created: <DisplayDate date={image.created_at} />
                      </p>
                    )}
                  </div>

                  {image.metadata && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium text-gray-600">
                        Metadata
                      </summary>
                      <pre className="mt-1 rounded bg-gray-50 p-2 text-xs">
                        {JSON.stringify(image.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
        {product.options && product.options.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Product Options</h2>
            <div className="space-y-4">
              {product.options.map((option) => (
                <div
                  key={option.id}
                  className="border-gray-200 border-b pb-4 last:border-b-0"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{option.title}</h3>
                    <span className="text-gray-500 text-sm">
                      ID: {option.id}
                    </span>
                  </div>

                  {option.values && option.values.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-gray-600 text-sm">Values:</span>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                          <div key={value.id} className="group relative">
                            <span className="rounded bg-gray-100 px-2 py-1 text-gray-800 text-sm">
                              {value.value}
                            </span>
                            <div className="-translate-x-1/2 absolute bottom-full left-1/2 z-10 mb-2 hidden rounded bg-black px-2 py-1 text-white text-xs group-hover:block">
                              ID: {value.id}
                              {value.created_at && (
                                <>
                                  <br />
                                  Created:{" "}
                                  <DisplayDate date={value.created_at} />
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {option.metadata && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-gray-600">
                        Option Metadata
                      </summary>
                      <pre className="mt-1 rounded bg-gray-50 p-2 text-xs">
                        {JSON.stringify(option.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 font-semibold text-xl">Variants</h2>
            <div className="space-y-6">
              {product.variants.map((variant) => (
                <div key={variant.id} className="rounded-lg border p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <h3 className="font-medium text-lg">
                      {variant.title || `Variant ${variant.id}`}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {variant.manage_inventory && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs">
                          Managed Inventory
                        </span>
                      )}
                      {variant.allow_backorder && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs">
                          Backorder Allowed
                        </span>
                      )}
                      {variant.variant_rank !== null && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-800 text-xs">
                          Rank: {variant.variant_rank}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="font-medium text-gray-600">ID:</span>{" "}
                      <span className="text-gray-900">{variant.id}</span>
                    </div>
                    {variant.sku && (
                      <div>
                        <span className="font-medium text-gray-600">SKU:</span>{" "}
                        <span className="text-gray-900">{variant.sku}</span>
                      </div>
                    )}
                    {variant.barcode && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Barcode:
                        </span>{" "}
                        <span className="text-gray-900">{variant.barcode}</span>
                      </div>
                    )}
                    {variant.upc && (
                      <div>
                        <span className="font-medium text-gray-600">UPC:</span>{" "}
                        <span className="text-gray-900">{variant.upc}</span>
                      </div>
                    )}
                    {variant.ean && (
                      <div>
                        <span className="font-medium text-gray-600">EAN:</span>{" "}
                        <span className="text-gray-900">{variant.ean}</span>
                      </div>
                    )}
                    {variant.inventory_quantity !== undefined && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Inventory:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.inventory_quantity}
                        </span>
                      </div>
                    )}
                    {variant.weight && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Weight:
                        </span>{" "}
                        <span className="text-gray-900">{variant.weight}g</span>
                      </div>
                    )}
                    {variant.length && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Length:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.length}cm
                        </span>
                      </div>
                    )}
                    {variant.width && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Width:
                        </span>{" "}
                        <span className="text-gray-900">{variant.width}cm</span>
                      </div>
                    )}
                    {variant.height && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Height:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.height}cm
                        </span>
                      </div>
                    )}
                    {variant.material && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Material:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.material}
                        </span>
                      </div>
                    )}
                    {variant.hs_code && (
                      <div>
                        <span className="font-medium text-gray-600">
                          HS Code:
                        </span>{" "}
                        <span className="text-gray-900">{variant.hs_code}</span>
                      </div>
                    )}
                    {variant.mid_code && (
                      <div>
                        <span className="font-medium text-gray-600">
                          MID Code:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.mid_code}
                        </span>
                      </div>
                    )}
                    {variant.origin_country && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Origin:
                        </span>{" "}
                        <span className="text-gray-900">
                          {variant.origin_country}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variant Thumbnail */}
                  {variant.thumbnail && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600">
                        Thumbnail:
                      </span>
                      <div className="mt-2 w-24">
                        <Image
                          src={variant.thumbnail}
                          alt={`${variant.title || "Variant"} thumbnail`}
                          width={100}
                          height={100}
                          className="rounded bg-gray-100 object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Variant Images */}
                  {variant.images && variant.images.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600">Images:</span>
                      <div className="mt-2 flex gap-2">
                        {variant.images.map((image, index) => (
                          <Image
                            key={image.id}
                            src={image.url}
                            alt={`${variant.title || "Variant"} ${index + 1}`}
                            width={80}
                            height={80}
                            className="rounded bg-gray-100 object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Variant Options */}
                  {variant.options && variant.options.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600">
                        Options:
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <span
                            key={option.id}
                            className="rounded bg-blue-100 px-2 py-1 text-blue-800 text-sm"
                          >
                            {option.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calculated Price */}
                  {variant.calculated_price && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-600">Price:</span>
                      <div className="mt-2">
                        <span className="font-bold text-green-600 text-lg">
                          {variant.calculated_price.currency_code?.toUpperCase()}{" "}
                          {(
                            (variant.calculated_price.calculated_amount || 0) /
                            100
                          ).toFixed(2)}
                        </span>
                        {variant.calculated_price.original_amount !==
                          variant.calculated_price.calculated_amount && (
                          <span className="ml-2 text-gray-500 line-through">
                            {(
                              (variant.calculated_price.original_amount || 0) /
                              100
                            ).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="mt-4 grid gap-2 border-gray-200 border-t pt-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="font-medium text-gray-600">
                        Created:
                      </span>{" "}
                      <span className="text-gray-900">
                        <DisplayDate date={variant.created_at} />
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        Updated:
                      </span>{" "}
                      <span className="text-gray-900">
                        <DisplayDate date={variant.updated_at} />
                      </span>
                    </div>
                    {variant.deleted_at && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Deleted:
                        </span>{" "}
                        <span className="text-gray-900">
                          <DisplayDate date={variant.deleted_at} />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Variant Metadata */}
                  {variant.metadata && (
                    <div className="mt-4">
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-gray-600">
                          Variant Metadata
                        </summary>
                        <pre className="mt-2 rounded bg-gray-50 p-2 text-xs">
                          {JSON.stringify(variant.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
