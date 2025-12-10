# How to find qualified shipping options by cart ID (Medusa.js Official AI)

[`listShippingOptionsForCartWithPricingWorkflow`](https://docs.medusajs.com/resources/references/medusa-workflows/listShippingOptionsForCartWithPricingWorkflow) workflow and provide a cart ID, Medusa determines which shipping options are qualified for that cart by evaluating the cart's context (such as region, items, shipping address, etc.) against the rules defined for each shipping option.

Here's how it works:

1. **Cart Context Extraction**: The workflow first retrieves the cart using the provided cart ID. It then builds a context object from the cart's properties (like region, customer, fulfillment address, etc.).

1. **Context Matching**: The workflow uses this context to filter shipping options. Each shipping option in Medusa can have rules (for example, only available in certain regions, for certain products, or for specific customer groups). Only shipping options whose rules match the cart's context are considered "qualified" and included in the result.

1. **Custom Context (Optional)**: You can further customize the context used for filtering by using the `setShippingOptionsContext` hook. For example, you might add the customer ID or other custom data to the context, which will then be used to match against shipping option rules. This allows for advanced scenarios, such as customer-specific shipping options or dynamic filtering based on additional cart data. The context is built right before shipping options are queried, ensuring it reflects the latest cart state and any custom logic you inject via hooks [setShippingOptionsContext](https://docs.medusajs.com/resources/references/medusa-workflows/listShippingOptionsForCartWithPricingWorkflow#hooks).

1. **Qualified Options Returned**: Only shipping options that match the context (i.e., their rules are satisfied by the cart's data) are returned by the workflow. The workflow also calculates and includes the price for each option, including those that require third-party provider calculations [Workflow Reference](https://docs.medusajs.com/resources/references/medusa-workflows/listShippingOptionsForCartWithPricingWorkflow#listshippingoptionsforcartwithpricingworkflow---medusa-core-workflows-reference).

**Summary**:

The workflow automatically filters and returns only the shipping options that are valid for the given cart, based on the cart's context and the rules defined on each shipping option. You can further customize the context used for filtering by implementing the `setShippingOptionsContext` hook if you need more advanced logic.

**References**:

- [listShippingOptionsForCartWithPricingWorkflow - Medusa Core Workflows Reference](https://docs.medusajs.com/resources/references/medusa-workflows/listShippingOptionsForCartWithPricingWorkflow#listshippingoptionsforcartwithpricingworkflow---medusa-core-workflows-reference)

- [Hooks: setShippingOptionsContext](https://docs.medusajs.com/resources/references/medusa-workflows/listShippingOptionsForCartWithPricingWorkflow#hooks)
