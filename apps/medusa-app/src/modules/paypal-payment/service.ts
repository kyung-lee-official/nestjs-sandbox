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
  UpdateAccountHolderInput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types";
import { AbstractPaymentProvider } from "@medusajs/framework/utils";
import { HttpError } from "@repo/types";

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
        "PAYMENT.MISSING_ACCOUNT_HOLDER",
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
    input: InitiatePaymentInput,
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context: customerDetails } = input;

    // assuming you have a client that initializes the payment
    const response = await this.client.init(
      amount,
      currency_code,
      customerDetails,
    );

    return {
      id: response.id,
      data: response,
    };
  }

  async listPaymentMethods({ context }: ListPaymentMethodsInput) {
    if (!context) {
      throw new HttpError(
        "PAYMENT.MISSING_CONTEXT",
        "Payment context is required.",
      );
    }

    const { account_holder } = context;
    const accountHolderId = account_holder?.data?.id as string | undefined;

    if (!accountHolderId) {
      throw new HttpError(
        "PAYMENT.MISSING_ACCOUNT_HOLDER",
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
        "PAYMENT.MISSING_ACCOUNT_HOLDER",
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
        "PAYMENT.MISSING_ACCOUNT_HOLDER",
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
        "PAYMENT.MISSING_CUSTOMER",
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

  static validateOptions(options: Record<any, any>) {
    if (!options.apiKey) {
      throw new HttpError(
        "PAYMENT.MISSING_API_KEY",
        "API key is required in the provider's options.",
      );
    }
  }
}

export default PayPalPaymentProviderService;
