import test from 'node:test';
import assert from 'node:assert/strict';
import { AGREEMENT_VERSION, requireAgreement } from '../lib/agreement.ts';

test('agreement rejects absent, unchecked, and stale consent', () => {
  const form = new FormData();
  assert.throws(() => requireAgreement(form));
  form.set('agreementVersion', AGREEMENT_VERSION);
  assert.throws(() => requireAgreement(form));
  form.set('agreementAccepted', 'yes');
  form.set('agreementVersion', 'old');
  assert.throws(() => requireAgreement(form));
  form.set('agreementVersion', AGREEMENT_VERSION);
  assert.doesNotThrow(() => requireAgreement(form));
});
