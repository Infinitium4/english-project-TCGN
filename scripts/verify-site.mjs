import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce', acceptDownloads: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const url = process.env.TCGN_TEST_URL || 'http://localhost:8000';
await mkdir('artifacts', { recursive: true });

try {
  for (const width of [320, 375, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto(url);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, content: document.documentElement.scrollWidth }));
    assert.ok(dimensions.content <= dimensions.viewport, `Horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
    assert.equal(await page.locator('h1').count(), 1);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute('href')).filter(href => href && href !== '#' && !document.getElementById(href.slice(1))));
    assert.deepEqual(brokenAnchors, []);
    await page.getByRole('button', { name: 'Déployer mon application', exact: true }).click();
    await page.locator('dialog[open]').waitFor();
    const modalOverflow = await page.locator('dialog').evaluate(element => element.scrollWidth > element.clientWidth);
    assert.equal(modalOverflow, false, `Form overflow at ${width}px`);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    if (width === 375) {
      await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
      await page.locator('nav').getByRole('link', { name: 'Souveraineté' }).click();
      assert.equal(await page.getByRole('button', { name: 'Ouvrir le menu' }).getAttribute('aria-expanded'), 'false');
      await page.locator('.dash-mobile-tabs').getByRole('button', { name: 'Services', exact: true }).click();
      assert.equal(await page.locator('.dash-heading h3').innerText(), 'Services');
    }
    if ([375, 1440].includes(width)) {
      await page.evaluate(async () => {
        for (const section of document.querySelectorAll('.section')) { section.scrollIntoView(); await new Promise(resolve => setTimeout(resolve, 40)); }
        window.scrollTo(0, 0);
      });
      await page.screenshot({ path: `artifacts/tcgn-${width}.png`, fullPage: true });
    }
    console.log(`PASS responsive, anchors and modal: ${width}px`);
  }
  await page.getByRole('button', { name: 'Optimise mes ressources GPU', exact: false }).click();
  assert.match(await page.locator('.recommendation').innerText(), /batching/);
  await page.locator('.dashboard aside').getByRole('button', { name: 'AI Insights', exact: true }).click();
  assert.match(await page.locator('.settings-panel').innerText(), /Aucun diagnostic réel/);
  await page.locator('.dashboard aside').getByRole('button', { name: 'Paramètres', exact: true }).click();
  assert.match(await page.locator('.settings-panel').innerText(), /Aucune configuration/);
  await page.locator('.dashboard aside').getByRole('button', { name: 'Vue d’ensemble', exact: true }).click();
  await page.getByLabel('Période des métriques').selectOption('7 jours');
  assert.match(await page.locator('.resource-chart').innerText(), /7 jours/);
  await page.getByRole('button', { name: 'Déployer mon application', exact: true }).click();
  await page.getByLabel('Votre nom').fill('Camille Test');
  await page.getByLabel('Email professionnel').fill('camille@example.com');
  await page.getByLabel('Type de projet').selectOption('Inférence LLM');
  await page.getByLabel('Workloads GPU', { exact: true }).check();
  await page.getByLabel('Localisation souhaitée').selectOption('France');
  await page.getByLabel('Ressources de calcul').selectOption('GPU / IA / LLM');
  await page.getByLabel('Parlez-nous de vos besoins').fill('Héberger une application et un modèle avec validation humaine des changements.');
  const mutations = [];
  page.on('request', request => { if (request.method() !== 'GET') mutations.push(request.url()); });
  await page.getByRole('button', { name: 'Préparer ma demande personnalisée' }).click();
  const summary = await page.locator('.project-summary').innerText();
  assert.match(summary, /Camille Test/);
  assert.match(summary, /Inférence LLM/);
  assert.match(summary, /Localisation souhaitée : France/);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Télécharger ma fiche' }).click();
  const download = await downloadEvent;
  assert.equal(download.suggestedFilename(), 'TCGN-mon-projet.txt');
  await page.getByRole('button', { name: 'Remplir une nouvelle demande' }).click();
  assert.equal(await page.getByLabel('Votre nom').inputValue(), '');
  assert.deepEqual(mutations, [new URL('project.php', url.endsWith('/') ? url : `${url}/`).href]);
  await page.keyboard.press('Escape');
  for (const name of ['Documentation', 'API', 'Status', 'Blog', 'Carrières', 'Mentions légales', 'Confidentialité', 'CGU', 'Contact']) {
    await page.locator('footer').getByRole('button', { name, exact: true }).click();
    assert.equal(await page.locator('dialog[open]').count(), 1);
    await page.keyboard.press('Escape');
  }
  assert.equal(await page.locator('input[type="password"]').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS scenarios, dashboard, PHP project form, download and resources');
} finally {
  await browser.close();
}
