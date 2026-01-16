import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CreateAccountHolderInput,
  DeleteAccountHolderInput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ListPaymentMethodsInput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrieveAccountHolderInput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  SavePaymentMethodInput,
  StoreCartAddress,
  UpdateAccountHolderInput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types";
import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import {
  type CreateOrderRequest,
  HttpError,
  type IntentType,
} from "@repo/types";
import axios from "axios";
import { PayPalConfig } from "./config";
import { paypalTokenManager } from "./token-manager";

type Options = {
  apiKey: string;
};

type InjectedDependencies = {
  logger: Logger;
};

class PayPalPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "paypal-payment";

  protected logger_: Logger;
  protected options_: Options;
  // assuming you're initializing a client
  protected client;

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options);

    this.logger_ = container.logger;
    this.options_ = options;

    // TODO initialize your client
  }

  async authorizePayment(
    input: AuthorizePaymentInput,
  ): Promise<AuthorizePaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that authorizes the payment
    const paymentData = await this.client.authorizePayment(externalId);

    return {
      data: paymentData,
      status: "authorized",
    };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that cancels the payment
    const paymentData = await this.client.cancelPayment(externalId);
    return { data: paymentData };
  }

  async capturePayment(
    input: CapturePaymentInput,
  ): Promise<CapturePaymentOutput> {
    if (input.data) {
    }

    const externalId = input.data?.id;

    // assuming you have a client that captures the payment
    const newData = await this.client.capturePayment(externalId);
    return {
      data: {
        ...newData,
        id: externalId,
      },
    };
  }

  async createAccountHolder({ context, data }: CreateAccountHolderInput) {
    const { account_holder, customer } = context;

    if (account_holder?.data?.id) {
      return { id: account_holder.data.id as string };
    }

    if (!customer) {
      throw new HttpError(
        "CUSTOMER.MISSING_CUSTOMER_DATA",
        "Missing customer data.",
      );
    }

    // assuming you have a client that creates the account holder
    const providerAccountHolder = await this.client.createAccountHolder({
      email: customer.email,
      ...data,
    });

    return {
      id: providerAccountHolder.id,
      data: providerAccountHolder as unknown as Record<string, unknown>,
    };
  }

  async deleteAccountHolder({ context }: DeleteAccountHolderInput) {
    const { account_holder } = context;
    const accountHolderId = account_holder?.data?.id as string | undefined;
    if (!accountHolderId) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_ACCOUNT_HOLDER",
        "Missing account holder ID.",
      );
    }

    // assuming you have a client that deletes the account holder
    await this.client.deleteAccountHolder({
      id: accountHolderId,
    });

    return {};
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that cancels the payment
    await this.client.cancelPayment(externalId);
    return {
      data: input.data,
    };
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput,
  ): Promise<GetPaymentStatusOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that retrieves the payment status
    const status = await this.client.getStatus(externalId);

    switch (status) {
      case "requires_capture":
        return { status: "authorized" };
      case "success":
        return { status: "captured" };
      case "canceled":
        return { status: "canceled" };
      default:
        return { status: "pending" };
    }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"],
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload;

    try {
      switch (data.event_type) {
        case "authorized_amount":
          return {
            action: "authorized",
            data: {
              // assuming the session_id is stored in the metadata of the payment
              // in the third-party provider
              session_id: (data.metadata as Record<string, any>).session_id,
              amount: new BigNumber(data.amount as number),
            },
          };
        case "success":
          return {
            action: "captured",
            data: {
              // assuming the session_id is stored in the metadata of the payment
              // in the third-party provider
              session_id: (data.metadata as Record<string, any>).session_id,
              amount: new BigNumber(data.amount as number),
            },
          };
        default:
          return {
            action: "not_supported",
            data: {
              session_id: "",
              amount: new BigNumber(0),
            },
          };
      }
    } catch (e) {
      return {
        action: "failed",
        data: {
          // assuming the session_id is stored in the metadata of the payment
          // in the third-party provider
          session_id: (data.metadata as Record<string, any>).session_id,
          amount: new BigNumber(data.amount as number),
        },
      };
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput & {
      data: {
        intent: IntentType;
        payment_collection_id: string;
        shipping_address: StoreCartAddress;
      };
    },
  ): Promise<InitiatePaymentOutput> {
    if (!process.env.PAYPAL_RETURN_URL || !process.env.PAYPAL_CANCEL_URL) {
      throw new HttpError(
        "SYSTEM.MISCONFIGURED",
        "PayPal return and cancel URLs must be set in environment variables.",
      );
    }

    const { amount, currency_code, data } = input;

    const orderPayload: CreateOrderRequest = {
      intent: data.intent,
      purchase_units: [
        {
          reference_id: data.payment_collection_id,
          amount: {
            currency_code: currency_code,
            value: amount as string,
          },
        },
      ],
      payment_source: {
        paypal: {
          address: {
            address_line_1: data.shipping_address.address_1 || "",
            address_line_2: data.shipping_address.address_2 || "",
            admin_area_1: data.shipping_address.city || "",
            admin_area_2: data.shipping_address.province || "",
            postal_code: data.shipping_address.postal_code || "",
            country_code: data.shipping_address.country_code || "",
          },
          email_address: "",
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          experience_context: {
            return_url: process.env.PAYPAL_RETURN_URL,
            cancel_url: process.env.PAYPAL_CANCEL_URL,
          },
        },
      },
    };

    try {
      const accessToken = await paypalTokenManager.getAccessToken();
      const paypalBaseURL = PayPalConfig.getBaseURL();

      const response = await axios.post(
        `${paypalBaseURL}/v2/checkout/orders`,
        orderPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        id: response.data.id,
        data: response.data,
      };
    } catch (error) {
      this.logger_.error("PayPal create order failed:", error);
      throw new HttpError(
        "PAYMENT.PAYPAL_FAILED_TO_CREATE_ORDER",
        "Failed to create PayPal order",
      );
    }
  }

  async listPaymentMethods({ context }: ListPaymentMethodsInput) {
    if (!context) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_CONTEXT",
        "Payment context is required.",
      );
    }

    const { account_holder } = context;
    const accountHolderId = account_holder?.data?.id as string | undefined;

    if (!accountHolderId) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_ACCOUNT_HOLDER",
        "Missing account holder ID.",
      );
    }

    // assuming you have a client that lists the payment methods
    const paymentMethods = await this.client.listPaymentMethods({
      customer_id: accountHolderId,
    });

    return paymentMethods.map((pm) => ({
      id: pm.id,
      data: pm as unknown as Record<string, unknown>,
    }));
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that refunds the payment
    const newData = await this.client.refund(externalId, input.amount);

    return {
      data: input.data,
    };
  }

  async retrieveAccountHolder({ id }: RetrieveAccountHolderInput) {
    // assuming you have a client that retrieves the account holder
    const providerAccountHolder = await this.client.retrieveAccountHolder({
      id,
    });

    return {
      id: providerAccountHolder.id,
      data: providerAccountHolder as unknown as Record<string, unknown>,
    };
  }

  async retrievePayment(
    input: RetrievePaymentInput,
  ): Promise<RetrievePaymentOutput> {
    const externalId = input.data?.id;

    // assuming you have a client that retrieves the payment
    return await this.client.retrieve(externalId);
  }

  async savePaymentMethod({ context, data }: SavePaymentMethodInput) {
    const accountHolderId = context?.account_holder?.data?.id as
      | string
      | undefined;

    if (!accountHolderId) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_ACCOUNT_HOLDER",
        "Missing account holder ID.",
      );
    }

    // assuming you have a client that saves the payment method
    const paymentMethod = await this.client.savePaymentMethod({
      customer_id: accountHolderId,
      ...data,
    });

    return {
      id: paymentMethod.id,
      data: paymentMethod as unknown as Record<string, unknown>,
    };
  }

  async updateAccountHolder({ context, data }: UpdateAccountHolderInput) {
    const { account_holder, customer } = context;

    if (!account_holder?.data?.id) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_ACCOUNT_HOLDER",
        "Missing account holder ID.",
      );
    }

    // assuming you have a client that updates the account holder
    const providerAccountHolder = await this.client.updateAccountHolder({
      id: account_holder.data.id,
      ...data,
    });

    return {
      id: providerAccountHolder.id,
      data: providerAccountHolder as unknown as Record<string, unknown>,
    };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const { amount, currency_code, context } = input;
    const externalId = input.data?.id;

    // Validate context.customer
    if (!context || !context.customer) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_CUSTOMER",
        "Context must include a valid customer.",
      );
    }

    // assuming you have a client that updates the payment
    const response = await this.client.update(externalId, {
      amount,
      currency_code,
      customer: context.customer,
    });

    return response;
  }

  static validateOptions(options: { clientId: string; clientSecret: string }) {
    if (!options.clientSecret) {
      throw new HttpError(
        "PAYMENT.PAYPAL_MISSING_CLIENT_SECRET",
        "API key is required in the provider's options.",
      );
    }
  }
}

export default PayPalPaymentProviderService;
