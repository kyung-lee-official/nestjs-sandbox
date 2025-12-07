# PayPal Order API README

## API-Only Recommended Payment Flow (Gemini 2.5 Flash)

Since you are avoiding the PayPal SDK, you will be performing a classic "**Create Order and Capture**" flow using the PayPal REST API, typically involving a redirect for the user to authorize the payment.

1.  **Frontend: Initiate Order**

    The user clicks a "Pay with PayPal" button on your Next.js client component.

    The frontend makes a `POST` request to your custom Next.js API route, for example, `/api/paypal/create-order`.

1.  **Backend: Create PayPal Order**

    The `/api/paypal/create-order` route performs the following steps **securely on the server**:

    -   Get Access Token: Use your stored Client ID and Client Secret to call the PayPal Generate Access Token API.

    -   Create Order: Call the PayPal Create Order API (`/v2/checkout/orders`) using the generated Access Token.

    -   Return Response: Return the PayPal-generated `orderID` and the relevant PayPal `approve` link (from the `links` array in the response) back to the frontend. Example

    ```json
    "links": [
        {
            "href": "https://api.sandbox.paypal.com/v2/checkout/orders/7HK8382586641930H",
            "rel": "self",
            "method": "GET"
        },
        {
            "href": "https://www.sandbox.paypal.com/checkoutnow?token=7HK8382586641930H",
            "rel": "payer-action",
            "method": "GET"
        }
    ]
    ```

    Here the `self` link is used by the backend to retrieve order details if needed, and the `payer-action` link is used to redirect the user for approval.

1.  Frontend: User Approval (Redirection)

    The frontend receives the `orderID` and the `approve` link.

    It redirects the user to the PayPal `approve` link. This is where the user logs into PayPal and authorizes the payment.

    After approval (or cancellation), PayPal redirects the user back to your site using the `return_url` (or `cancel_url`) you specified in the Create Order API call.

1.  Backend: Capture Payment

    The user is redirected back to a page/route on your Next.js app (e.g., `/checkout/success?token=...&PayerID=...`).

    This success page/route extracts the necessary data (like the `token` or `orderID` if available) and makes a final `POST` request to your _Capture Payment_ API route, e.g., /api/paypal/capture-payment.

    The `/api/paypal/capture-payment` route performs the final steps securely on the server:

    -   **Get Access Token**: If the current token is expired, generate a new Access Token.

    -   **Capture Order**: Call the PayPal **Capture Order API** (`/v2/checkout/orders/{order_id}/capture`) using the Access Token.

    -   **Fulfill Order**: Once the capture response is received and the status is `COMPLETED`, **update your database** to fulfill the order and mark the transaction as paid.

    -   **Return Confirmation**: Return a final success/failure response to the frontend.

1.  Frontend: Final Confirmation

    The frontend displays a final confirmation page to the user based on the response from the _Capture Payment_ route.

**Sources**:

https://dev.to/husnain/how-to-integrate-paypal-with-nextjs-2oil

https://developer.paypal.com/studio/checkout/standard/integrate

https://www.niftylittleme.com/articles/integrating-paypal-checkout-into-your-nextjs-project

https://medium.com/@justinbartlettjob/simple-paypal-next-js-15-integration-7adc8929aa17

## PayPal AUTHORIZE vs CAPTURE

PayPal offers two different payment intents:

1. AUTHORIZE - Reserves funds but doesn't transfer them immediately
1. CAPTURE - Actually transfers the reserved funds to the merchant

The Two-Step Process:

Step 1: AUTHORIZE (Customer Action)

-   The customer approves the payment on PayPal's site.
-   PayPal reserves the funds but does not transfer them yet.
-   Money is held for a limited time (usually 29 days).
-   The order status becomes "APPROVED".

Step 2: CAPTURE (Merchant Action)

-   The merchant decides when to capture the funds.
-   PayPal transfers the reserved funds to the merchant's account.
-   The order status becomes "COMPLETED".

Who Performs What?

| Action    | Performed By          | When                                                    |
| --------- | --------------------- | ------------------------------------------------------- |
| AUTHORIZE | Customer (via PayPal) | During checkout (PayPal redirect)                       |
| CAPTURE   | Merchant (via API)    | After customer approval, and order fulfillment/shipping |

Business Use Cases:

AUTHORIZE Intent is useful for:

-   Pre-orders - Reserving funds for items not yet available
-   Custom/Made-to-order products - Ensure payment before manufacturing
-   Physical goods - Capture funds after shipping to avoid fraud
-   Services - Capture when service is delivered
-   Fraud prevention - Time to verify orders before capturing funds

**⚠️ Important Note for AUTHORIZE Intent:**
When capturing an order created with `AUTHORIZE` intent, you must follow a **two-step API process**:

1. **First**: Call the authorize endpoint to authorize the approved payment
    ```
    POST /v2/checkout/orders/{order_id}/authorize
    ```
2. **Second**: Use the returned authorization ID to capture the funds
    ```
    POST /v2/payments/authorizations/{authorization_id}/capture
    ```

You **cannot** directly call `/v2/checkout/orders/{order_id}/capture` on an AUTHORIZE intent order, as this will result in an `ACTION_DOES_NOT_MATCH_INTENT` error.

Direct CAPTURE Intent (single step) is suitable for:

-   Digital goods - Immediate delivery after payment
-   Subscriptions - Regular, automated billing
-   Simple purchases - Low-risk transactions with instant fulfillment
