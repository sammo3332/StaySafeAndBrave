export const demoPaymentMethods = ['card', 'paypal', 'apple_pay', 'google_pay'] as const;
export type DemoPaymentMethod = typeof demoPaymentMethods[number];

export function paymentMethodLabel(method?: DemoPaymentMethod, language: 'de' | 'en' = 'de') {
  if (!method) return language === 'de' ? 'Virtuelle Demo-Zahlung' : 'Virtual demo payment';
  return { card: language === 'de' ? 'Kredit-/Debitkarte' : 'Credit / debit card', paypal: 'PayPal', apple_pay: 'Apple Pay', google_pay: 'Google Pay' }[method];
}

// Wallets are offered by hosted Stripe Checkout under "card", never as API types.
// Delayed methods require a separate payment lifecycle before they can be enabled.
export type CheckoutPaymentMethod = 'card' | 'paypal';
export function checkoutPaymentMethods(setting?: string): CheckoutPaymentMethod[] {
  if (setting === undefined) return ['card'];
  const methods = setting.split(',').map(value => value.trim());
  if (!methods.length || methods.some(value => value !== 'card' && value !== 'paypal')) {
    throw new Error('SSB_STRIPE_PAYMENT_METHODS must contain only card and/or paypal.');
  }
  return [...new Set(methods)] as CheckoutPaymentMethod[];
}
