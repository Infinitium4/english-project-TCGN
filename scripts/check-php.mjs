import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.TCGN_TEST_URL || 'http://localhost:8000';
const endpoint = new URL('project.php', `${base.replace(/\/$/, '')}/`);
const valid = {
  name: 'Camille Test', email: 'camille@example.com', project: 'Inférence LLM',
  infrastructure: 'Nouveau projet', timeline: 'À définir ensemble', region: 'France',
  compute: 'GPU / IA / LLM', details: 'Héberger mon application.', 'services[]': 'Workloads GPU',
};
async function post(fields) {
  return fetch(endpoint, { method: 'POST', body: new URLSearchParams(fields), headers: { Accept: 'application/json' } });
}
for (const fields of [
  { ...valid, email: 'invalid' },
  { ...valid, name: '' },
  { ...valid, details: 'a'.repeat(4001) },
  { ...valid, region: 'Unknown' },
  { ...valid, 'services[]': 'Unknown' },
  { ...valid, 'name[]': 'Array', name: undefined },
]) {
  if (fields.name === undefined) delete fields.name;
  const response = await post(fields);
  assert.equal(response.status, 422);
  assert.equal(typeof (await response.json()).error, 'string');
}
const response = await post({ ...valid, name: '<script>alert(1)</script>' });
assert.equal(response.status, 200);
assert.match((await response.json()).summary, /<script>alert\(1\)<\/script>/);
assert.equal((await fetch(endpoint, { method: 'PUT' })).status, 405);
for (const path of ['config/resources.json', 'templates/content.php', '../config/resources.json']) {
  assert.equal((await fetch(new URL(path, `${base}/`))).status, 404);
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base);
  for (const button of await page.locator('.hero-buttons button, #tarifs button, .cta button').all()) {
    console.log('Checking action:', await button.innerText());
    await button.click();
    assert.equal(await page.locator('dialog[open] .project-form').count(), 1);
    await page.keyboard.press('Escape');
  }
  const context = await browser.newContext({ javaScriptEnabled: false, acceptDownloads: true });
  const fallback = await context.newPage();
  await fallback.goto(endpoint.href);
  await fallback.getByLabel('Votre nom').fill(valid.name);
  await fallback.getByLabel('Email professionnel').fill(valid.email);
  await fallback.getByLabel('Type de projet').selectOption(valid.project);
  await fallback.getByLabel('Parlez-nous de vos besoins').fill(valid.details);
  assert.equal(await fallback.locator('form').evaluate(form => form.checkValidity()), true);
  const downloadEvent = fallback.waitForEvent('download').catch(error => error);
  const submission = fallback.waitForResponse(response => response.url() === endpoint.href && response.request().method() === 'POST').catch(error => error);
  // Chromium disables the animation frames used by Playwright's stability check
  // when JavaScript is off. Send a real click without that check.
  await fallback.getByRole('button', { name: 'Préparer ma demande personnalisée' }).click({ force: true });
  const submitted = await submission;
  assert.equal(submitted.status(), 200, await submitted.text().catch(() => 'Download response'));
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'TCGN-mon-projet.txt');
  await context.close();
} finally { await browser.close(); }
console.log('PASS PHP validation, private files, CTA buttons and form without JavaScript');
