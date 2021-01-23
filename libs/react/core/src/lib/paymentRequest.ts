const isSupported = 'PaymentRequest' in window;

export const pay = async (
  details: PaymentDetailsInit,
  methods: PaymentMethodData[] = [{ supportedMethods: 'basic-card' }],
  options: PaymentOptions = {}
) => {
  if (!isSupported) {
    return Promise.reject(new Error('Payment Request is not supported in your browser'));
  }

  const gateway = new PaymentRequest(methods, details, options);
  const canPay = await gateway.canMakePayment();

  return canPay
    ? gateway.show()
    : Promise.reject(new Error('Payment Request cannot make the payment'));
};
