import { DOCUMENT } from '@angular/common';
import { Inject, inject, Injectable, InjectionToken } from '@angular/core';

import { PaymentRequestPlatformService } from '@bookapp/angular/core';

export const PAYMENT_REQUEST_SUPPORT = new InjectionToken<boolean>(
  'Is Payment Request Api supported?',
  {
    factory: () => {
      const document = inject(DOCUMENT);

      return document.defaultView !== null && 'PaymentRequest' in document.defaultView;
    },
  }
);

@Injectable()
export class PaymentRequestService extends PaymentRequestPlatformService {
  constructor(@Inject(PAYMENT_REQUEST_SUPPORT) private readonly supported: boolean) {
    super();
  }

  async request(
    details: PaymentDetailsInit,
    methods: PaymentMethodData[] = [{ supportedMethods: 'basic-card' }],
    options: PaymentOptions = {}
  ): Promise<PaymentResponse> {
    if (!this.supported) {
      return Promise.reject(new Error('Payment Request is not supported in your browser'));
    }

    const gateway = new PaymentRequest(methods, details, options);
    const canPay = await gateway.canMakePayment();

    return canPay
      ? gateway.show()
      : Promise.reject(new Error('Payment Request cannot make the payment'));
  }
}
