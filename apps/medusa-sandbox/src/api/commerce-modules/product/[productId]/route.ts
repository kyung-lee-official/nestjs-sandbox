import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params;
  const { region_id } = req.query;

  if (!productId) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Missing product ID");
  }

  if (!region_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Missing query parameter: region_id",
    );
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  /**
   * TODO: Implement proper matching logic for regionId
   */
  /* Get product with variants and all prices first */
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["*", "variants.*", "variants.prices.*"],
    filters: {
      id: productId,
    },
  });
  if (!products || products.length === 0) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No products found");
  }
  const product = products[0];

  /* Get region to find its currency */
  const regionModuleService = req.scope.resolve(Modules.REGION);
  const region = await regionModuleService.retrieveRegion(region_id as string);

  if (!region) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Region with ID ${region_id} not found`,
    );
  }

  /* Filter prices by region's currency and region-specific rules */
  product.variants = product.variants?.map(
    (variant: any & { prices: any[] }) => {
      if (variant.prices) {
        variant.prices = variant.prices.filter((price) => {
          /* Filter by currency code matching the region */
          const matchesCurrency = price.currency_code === region.currency_code;
          return matchesCurrency;
        });
      }
      return variant;
    },
  );

  return res.status(200).json(product);
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "Missing product ID" });
  }

  const productModuleService = req.scope.resolve(Modules.PRODUCT);
  const product = await productModuleService.retrieveProduct(productId);
  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Product with the given ID does not exist",
    );
  }

  await deleteProductsWorkflow(req.scope).run({
    input: {
      ids: [productId],
    },
  });

  return res.status(204).send({
    message: "Product deleted successfully",
  });
}
