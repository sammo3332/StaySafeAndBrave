'use client';

import { useId } from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { demoPaymentMethods, paymentMethodLabel, type DemoPaymentMethod } from '@/lib/payment-methods';

export function PaymentMethodPicker({ value, onChange, disabled = false, language = 'de' }: {
  value: DemoPaymentMethod;
  onChange: (method: DemoPaymentMethod) => void;
  disabled?: boolean;
  language?: 'de' | 'en';
}) {
  const id = useId();
  const english = language === 'en';
  const descriptions = english ? {
    card: 'Simulate a card payment. No card number, expiry date or security code is needed.',
    paypal: 'Simulate a PayPal payment. No PayPal account is opened or connected.',
    apple_pay: 'Simulate Apple Pay on any device. No wallet or biometric confirmation is requested.',
    google_pay: 'Simulate Google Pay on any device. No Google account or wallet is connected.',
  } : {
    card: 'Probiere eine Kartenzahlung aus. Du brauchst weder Kartennummer noch Ablaufdatum oder Sicherheitscode.',
    paypal: 'Probiere eine PayPal-Zahlung aus. Es wird kein PayPal-Konto geöffnet oder verbunden.',
    apple_pay: 'Probiere Apple Pay auf jedem Gerät aus. Es wird keine Wallet geöffnet und keine biometrische Bestätigung angefordert.',
    google_pay: 'Probiere Google Pay auf jedem Gerät aus. Es wird kein Google-Konto und keine Wallet verbunden.',
  };
  return <fieldset disabled={disabled} aria-describedby={`${id}-description`} className="my-5 min-w-0">
    <legend className="mb-4 text-xl font-semibold">{english ? 'Choose a demo payment method' : 'Deine Demo-Zahlungsmethode'}</legend>
    <div className="grid gap-3 sm:grid-cols-2">
      {demoPaymentMethods.map(method => {
        const Icon = method === 'card' ? CreditCard : method === 'paypal' ? Wallet : Smartphone;
        return <label key={method} className={`flex min-h-24 min-w-0 cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${value === method ? 'border-primary bg-secondary/60' : 'bg-background hover:bg-muted/40'} ${disabled ? 'cursor-wait opacity-60' : ''}`}>
          <input type="radio" name={`${id}-payment-method`} value={method} checked={value === method} onChange={() => onChange(method)} className="h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" />
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{paymentMethodLabel(method, language)}</span><span className="mt-1 block text-xs text-muted-foreground">{english ? 'Simulation · €0.00 charged' : 'Simulation · 0,00 € Abbuchung'}</span></span>
          <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </label>;
      })}
    </div>
    <div id={`${id}-description`} role="status" className="mt-4 rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed">
      <p>{descriptions[value]}</p><p className="mt-2 text-xs text-muted-foreground">{english ? 'Local simulation only. No payment provider is contacted and no account is charged.' : 'Nur eine lokale Simulation. Kein Zahlungsdienst wird kontaktiert und kein Konto belastet.'}</p>
    </div>
  </fieldset>;
}
