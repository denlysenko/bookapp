export abstract class PaymentRequestPlatformService {
  abstract request(
    details: PaymentDetailsInit,
    methods?: PaymentMethodData[],
    options?: PaymentOptions
  ): Promise<PaymentResponse>;
}
