// Exercise the actual TypeScript domain module, with no browser or service calls.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  module._compile(result.outputText, filename);
};
const { demoReducer: reduce, initialDemo, restoreDemo, tripError, demoPackages, futureDate, DEMO_STORAGE_KEY } = require('../src/lib/demo-booking.ts');
const { originalMentors } = require('../src/components/content/original-mentors.ts');
function cart(packageId = 'standard') { const s = reduce(initialDemo(), { type: 'choose', packageId }); return reduce(s, { type: 'cart', trip: s.trip }); }
const payment = outcome => ({ type: 'payment', outcome, reference: 'DEMO-TEST-000001', createdAt: new Date().toISOString() });
test('a package and valid trip are required before payment', () => {
  let s = initialDemo();
  assert.equal(reduce(s, payment('success')).receipt, null);
  s = reduce(s, { type: 'cart', trip: s.trip }); assert.equal(s.inCart, false);
  s = reduce(s, { type: 'choose', packageId: 'basis' });
  assert.equal(reduce(s, payment('success')).receipt, null);
  assert.equal(reduce(s, { type: 'cart', trip: { ...s.trip, arrival: '2020-01-01' } }).inCart, false);
});
test('invalid calendar dates, reverse dates, blank name and long stays fail', () => {
  const t = initialDemo().trip;
  for (const patch of [{ name: ' ' }, { arrival: '2099-02-31' }, { departure: futureDate(1) }, { departure: futureDate(60) }]) assert.ok(tripError({ ...t, ...patch }));
  assert.equal(tripError(t), '');
});
test('decline and cancellation preserve cart, never confirm; retry succeeds once', () => {
  for (const outcome of ['declined', 'cancelled']) {
    const s = reduce(cart(), payment(outcome));
    assert.equal(s.receipt, null); assert.equal(s.inCart, true); assert.ok(s.paymentError);
    const paid = reduce(s, payment('success')); assert.equal(paid.receipt.amount, 19500); assert.equal(paid.inCart, false); assert.equal(paid.paymentError, '');
    assert.strictEqual(reduce(paid, { ...payment('success'), reference: 'DEMO-SECOND-0001' }), paid);
    assert.strictEqual(reduce(paid, payment('declined')), paid);
  }
});
test('canonical catalog totals and exact package inclusions', () => {
  assert.deepEqual(demoPackages.map(p => p.amount), [9500, 19500, 29500]);
  assert.deepEqual(demoPackages.map(p => p.features.length), [4, 6, 9]);
  assert.ok(!demoPackages[1].features.includes('getready'));
  for (const pkg of demoPackages) assert.equal(reduce(cart(pkg.id), payment('success')).receipt.amount, pkg.amount);
});
test('all nine profiles can be selected; unknown profiles cannot', () => {
  assert.equal(originalMentors.length, 9);
  for (const m of originalMentors) assert.equal(reduce(initialDemo(), { type: 'choose', mentorId: m.id }).mentorId, m.id);
  const s = cart(); assert.strictEqual(reduce(s, { type: 'choose', mentorId: 'missing' }), s);
});
test('remove and change invalidate cart; changing a confirmed selection clears follow-up state', () => {
  const s = cart(); assert.equal(reduce(s, { type: 'remove' }).inCart, false);
  assert.equal(reduce(s, { type: 'choose', packageId: 'premium' }).inCart, false);
  let paid = reduce(s, payment('success'));
  paid = reduce(paid, { type: 'message', text: 'Hallo' }); paid = reduce(paid, { type: 'check', index: 0 });
  const changed = reduce(paid, { type: 'choose', mentorId: 'leonie-koester' });
  assert.equal(changed.receipt, null); assert.deepEqual(changed.messages, []); assert.deepEqual(changed.checklist, []);
});
test('follow-up tools require confirmed simulation and survive refresh', () => {
  const s = cart(); assert.deepEqual(reduce(s, { type: 'message', text: 'Hallo' }).messages, []);
  assert.equal(reduce(s, { type: 'appointment', time: '10:00' }).appointment, '');
  let paid = reduce(s, payment('success')); paid = reduce(paid, { type: 'check', index: 2 });
  paid = reduce(paid, { type: 'appointment', time: '14:00' }); paid = reduce(paid, { type: 'message', text: '  Hallo  ' });
  assert.deepEqual(restoreDemo(JSON.stringify(paid)), paid);
  assert.deepEqual(reduce(paid, { type: 'check', index: 2 }).checklist, []);
  assert.strictEqual(reduce(paid, { type: 'check', index: 9 }), paid);
});
test('corrupt, old-version and inconsistent stored data reset safely', () => {
  const paid = reduce(cart(), payment('success'));
  for (const raw of ['{bad', JSON.stringify({ ...paid, version: 0 }), JSON.stringify({ ...paid, inCart: true }), JSON.stringify({ ...paid, receipt: { ...paid.receipt, amount: 1 } }), JSON.stringify({ ...paid, mentorId: 'no' })]) assert.equal(restoreDemo(raw).receipt, null);
  assert.equal(restoreDemo(JSON.stringify(cart())).inCart, true);
  assert.notEqual(DEMO_STORAGE_KEY, 'ssb_cart_package');
});
test('an expired cart cannot be paid after reopening', () => {
  const stale = { ...cart(), trip: { ...cart().trip, arrival: '2020-01-01', departure: '2020-01-10' } };
  const restored = restoreDemo(JSON.stringify(stale)); assert.equal(restored.inCart, true);
  assert.equal(reduce(restored, payment('success')).receipt, null);
});
test('reset clears receipt and all personal demo inputs', () => {
  const paid = reduce(cart(), payment('success')); assert.deepEqual(reduce(paid, { type: 'reset' }), initialDemo());
});
test('demo modules have no production transaction or network integrations', () => {
  for (const file of ['src/components/demo/demo-flow.tsx', 'src/components/demo/demo-provider.tsx', 'src/lib/demo-booking.ts']) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(source, /fetch\s*\(|axios|firebase|stripe|\/api\/|sendEmail|addDoc\s*\(|setDoc\s*\(/i, file);
  }
});
test('package entitlements reject unavailable services and stage skipping',()=>{
 let basic=reduce(cart('basis'),payment('success'));assert.strictEqual(reduce(basic,{type:'service',service:'arrival',value:'landed'}),basic);assert.strictEqual(reduce(basic,{type:'service',service:'ready',value:'scheduled'}),basic);
 let premium=reduce(cart('premium'),payment('success'));assert.strictEqual(reduce(premium,{type:'service',service:'arrival',value:'arrived'}),premium);premium=reduce(premium,{type:'service',service:'arrival',value:'landed'});assert.equal(premium.services.arrival,'landed');
});
test('multiple journeys, cancellation and changes stay isolated',()=>{
 let first=reduce(cart('premium'),payment('success'));first=reduce(first,{type:'service',service:'ready',value:'scheduled'});const second=reduce(first,{type:'new-trip'});assert.equal(second.trips.length,1);assert.equal(second.receipt,null);let restored=reduce(second,{type:'open-trip',reference:first.receipt.reference});assert.equal(restored.services.ready,'scheduled');restored=reduce(restored,{type:'change-trip',trip:{...restored.trip,arrival:futureDate(23)}});assert.equal(restored.services.ready,'none');restored=reduce(restored,{type:'cancel-trip'});assert.equal(restored.refundAmount,29500);assert.strictEqual(reduce(restored,{type:'service',service:'ready',value:'scheduled'}),restored);assert.strictEqual(reduce(restored,{type:'cancel-trip'}),restored);
});

const { demoPaymentMethods, paymentMethodLabel, checkoutPaymentMethods } = require('../src/lib/payment-methods.ts');
test('each demo method supports decline, retry, persistence and an immutable receipt', () => {
  for (const method of demoPaymentMethods) {
    let s = reduce(cart(), { type: 'payment-method', method });
    assert.equal(restoreDemo(JSON.stringify(s)).paymentMethod, method);
    s = reduce(s, payment('declined'));
    assert.equal(s.paymentMethod, method); assert.equal(s.receipt, null); assert.equal(s.inCart, true);
    s = reduce(s, { type: 'payment-method', method }); assert.equal(s.paymentError, '');
    s = reduce(s, payment('success')); assert.equal(s.receipt.paymentMethod, method);
    assert.deepEqual(restoreDemo(JSON.stringify(s)), s);
    assert.strictEqual(reduce(s, { type: 'payment-method', method: 'paypal' }), s);
    const next = reduce(s, { type: 'new-trip' });
    assert.equal(next.paymentMethod, 'card'); assert.equal(next.trips[0].receipt.paymentMethod, method);
    assert.equal(reduce(next, { type: 'open-trip', reference: s.receipt.reference }).receipt.paymentMethod, method);
    const cancelled = reduce(s, { type: 'cancel-trip' });
    assert.equal(cancelled.receipt.paymentMethod, method); assert.equal(cancelled.refundAmount, 19500);
  }
});
test('legacy journeys stay readable without inventing a payment method on old receipts', () => {
  const old = reduce(cart(), payment('success'));
  delete old.paymentMethod; delete old.receipt.paymentMethod;
  const restored = restoreDemo(JSON.stringify(old));
  assert.equal(restored.paymentMethod, 'card'); assert.equal(restored.receipt.reference, old.receipt.reference);
  assert.equal(restored.receipt.paymentMethod, undefined);
  assert.equal(paymentMethodLabel(restored.receipt.paymentMethod), 'Virtuelle Demo-Zahlung');
  assert.equal(paymentMethodLabel(undefined, 'en'), 'Virtual demo payment');
  const pending = cart(); delete pending.paymentMethod;
  assert.equal(restoreDemo(JSON.stringify(pending)).inCart, true);
  const s = cart(); assert.strictEqual(reduce(s, { type: 'payment-method', method: 'unknown' }), s);
});
test('hosted checkout allows configured immediate methods and rejects unsupported API types', () => {
  assert.deepEqual(checkoutPaymentMethods(), ['card']);
  assert.deepEqual(checkoutPaymentMethods(' card, paypal,card '), ['card','paypal']);
  assert.deepEqual(checkoutPaymentMethods('paypal'), ['paypal']);
  for (const value of ['', 'card,', 'apple_pay', 'google_pay', 'sepa_debit', 'klarna', 'card,unknown']) assert.throws(() => checkoutPaymentMethods(value));
});
