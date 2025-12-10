# Medusa.js Official AI Checkout Flow

Step: Prompt the customer to enter their email address (or pre-fill if logged in).

**Why**: The email is required for order confirmation and communication.
[Checkout Flow Overview](https://docs.medusajs.com/resources/storefront-development/checkout)

---

Step: Gather shipping and billing address details from the customer.

**Why**: Addresses are needed to calculate shipping options, taxes, and for order fulfillment.
[Checkout Flow Overview](https://docs.medusajs.com/resources/storefront-development/checkout)

---

Step: Present available shipping methods based on the provided address and let the customer choose one.

**Why**: Shipping method selection determines delivery options and costs, which may affect the total order amount.
[Checkout Flow Overview](https://docs.medusajs.com/resources/storefront-development/checkout)

---

Step:

- Retrieve available payment providers for the cart’s region.
- Let the customer select a payment provider.
- If needed, create a payment collection for the cart and initialize payment sessions.
- Collect any additional payment details (e.g., card info for Stripe) as required by the provider.

**Why**: Payment provider selection is essential for processing the transaction. Initializing the payment session ensures the provider is ready to authorize the payment when the order is placed.
[Payment Step Details](https://docs.medusajs.com/resources/storefront-development/checkout/payment)

---

Step:

- Perform any required actions with the payment provider (e.g., authorize payment).
- Call the Complete Cart API to finalize the order.

**Why**: This step authorizes the payment and creates the order in Medusa. If payment authorization fails or requires additional action, handle it before retrying.

[Complete Cart Step](https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart)
[Payment Flow Details](https://docs.medusajs.com/resources/commerce-modules/payment/payment-checkout-flow)

---

Step:

- On successful cart completion, unset the cart (remove cart ID from storage).
- Redirect the customer to an order confirmation page.

**Why**: The cart is no longer valid after order placement. The confirmation page provides feedback and order details to the customer.

[Order Confirmation](https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart)

---

Step:

- The fulfillment process is typically triggered automatically after order creation.
- The merchant or automated system processes the order for shipping and delivery.

**Why**: Fulfillment ensures the purchased products are delivered to the customer. This step is handled by the merchant/admin and is not part of the customer-facing checkout flow, but is essential for completing the transaction lifecycle.
[Checkout Flow Overview](https://docs.medusajs.com/resources/storefront-development/checkout)

---

Summary Table:

| Step             | Action                                   | Why/Notes                                   |
| ---------------- | ---------------------------------------- | ------------------------------------------- |
| 1. Email         | Collect customer email                   | For communication and order confirmation    |
| 2. Address       | Collect shipping/billing address         | Needed for shipping, taxes, and fulfillment |
| 3. Shipping      | Select shipping method                   | Determines delivery options and costs       |
| 4. Payment       | Choose provider, initialize session      | Prepares for payment authorization          |
| 5. Complete Cart | Authorize payment, place order           | Finalizes transaction and creates the order |
| 6. Confirmation  | Unset cart, show confirmation page       | Ends checkout, informs customer             |
| 7. Fulfillment   | Process and ship order (admin/automated) | Delivers products to customer               |

---

Emphasis on Order:

- Addresses and shipping must be set before payment because shipping costs and taxes may affect the total amount to be paid.
- Payment session must be initialized before completing the cart to ensure the payment provider is ready to process the transaction.
- Cart must be completed before fulfillment because fulfillment is based on a confirmed order.

If you need code examples or more details for any step, let me know!

# Differences Between cart.shipping_methods and fulfillment.shipping_options (Medusa.js Official AI )

Shipping options and shipping methods are not the same thing in Medusa - they are related but distinct concepts.

A shipping option is a way of shipping an item offered by a fulfillment provider. According to the [shipping option documentation](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option), it represents the available shipping choices (like express or standard shipping) that a fulfillment provider offers.

Shipping options are:

- Configured in advance by merchants

- Associated with fulfillment providers

- Restricted by service zones and custom rules

- Available for customers to choose from during checkout

A shipping method is created from a shipping option when a customer makes their selection during checkout. As explained in the [cart concepts guide](https://docs.medusajs.com/resources/commerce-modules/cart/concepts#shipping-methods), a shipping method is used to fulfill the items in the cart after the order is placed.

The relationship is described in the [cart-fulfillment link documentation](https://docs.medusajs.com/resources/commerce-modules/cart/links-to-other-modules#fulfillment-module):

"In the Medusa application, the shipping method is created from a shipping option, available through the Fulfillment Module. Its ID is stored in the `shipping_option_id` property of the method."

1. Shipping options are retrieved for a cart using the [List Shipping Options API](https://docs.medusajs.com/api/store#shipping-options_getshippingoptions)

1. Customer selects their preferred shipping option

1. A shipping method is created and attached to the cart using the [Add Shipping Method API](https://docs.medusajs.com/api/store#carts_postcartsidshippingmethods)

1. The shipping method is then used for fulfillment after order placement

Think of it this way: shipping options are the **available choices**, while shipping methods are the **selected choice** attached to a specific cart or order.
