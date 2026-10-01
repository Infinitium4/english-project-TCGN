'use strict';

const dialog = document.querySelector('dialog');
const dialogContent = document.querySelector('#dialog-content');
const navigation = document.querySelector('#main-navigation');
const burger = document.querySelector('.burger');
let opener;
let currentSummary = '';

function setMenu(expanded) {
  navigation.classList.toggle('expanded', expanded);
  burger.setAttribute('aria-expanded', String(expanded));
  burger.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu');
}
function openModal(name) {
  opener = document.activeElement;
  const project = ['Mon projet', 'Parler à un expert', 'Contact', 'Commencer'].includes(name);
  document.querySelector('#dialog-title').textContent = name === 'Mon projet' || name === 'Commencer' ? 'Votre application. Vos contraintes.' : name;
  const template = project ? document.querySelector('#project-template') : [...document.querySelectorAll('template[data-resource]')].find(el => el.dataset.resource === name);
  dialogContent.replaceChildren(template.content.cloneNode(true));
  currentSummary = '';
  setMenu(false);
  dialog.showModal();
}
dialog.addEventListener('close', () => { dialogContent.replaceChildren(); currentSummary = ''; opener?.focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (event.target.closest('nav a')) setMenu(false);
  if (!button) return;
  if (button === burger) return setMenu(burger.getAttribute('aria-expanded') !== 'true');
  if (button.matches('.modal-close, [data-close]')) return dialog.close();
  if (button.matches('[data-explore-dashboard]')) {
    dialog.close();
    document.querySelector('#dashboard').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    return;
  }
  if (button.closest('.dashboard aside, .dash-mobile-tabs')) {
    const tab = button.textContent.trim();
    const template = [...document.querySelectorAll('[data-dashboard-view]')].find(el => el.dataset.dashboardView === tab);
    document.querySelector('.dash-main').replaceChildren(template.content.cloneNode(true));
    document.querySelectorAll('.dashboard aside button, .dash-mobile-tabs button').forEach(el => {
      const selected = el.textContent.trim() === tab;
      el.setAttribute('aria-pressed', String(selected));
      el.classList.toggle('selected', selected);
    });
    return;
  }
  if (button.closest('.scenario-list')) {
    const buttons = [...document.querySelectorAll('.scenario-list button')];
    const index = buttons.indexOf(button);
    document.querySelector('.recommendation').replaceChildren(document.querySelector(`[data-recommendation="${index}"]`).content.cloneNode(true));
    buttons.forEach(el => { el.classList.toggle('active', el === button); el.setAttribute('aria-pressed', String(el === button)); });
    return;
  }
  if (button.matches('[data-download]')) {
    const url = URL.createObjectURL(new Blob([currentSummary], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TCGN-mon-projet.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (button.matches('.project-reset')) {
    dialogContent.replaceChildren(document.querySelector('#project-template').content.cloneNode(true));
    currentSummary = '';
    return;
  }
  if (button.closest('footer') || button.matches('.login, .nav-start') || button.closest('.hero-buttons, #tarifs, .cta')) {
    const text = button.textContent.trim();
    openModal(button.closest('main') && text !== 'Parler à un expert' ? 'Mon projet' : text);
  }
});
document.addEventListener('change', event => {
  if (event.target.matches('.dash-heading select')) document.querySelector('.resource-chart > div > span').textContent = event.target.value;
});
document.addEventListener('submit', async event => {
  const form = event.target;
  if (!form.matches('.project-form')) return;
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  form.querySelector('[role="alert"]')?.remove();
  try {
    const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Impossible de préparer votre fiche. Réessayez.');
    currentSummary = result.summary;
    const success = document.createElement('div');
    success.className = 'success';
    success.setAttribute('role', 'status');
    success.innerHTML = '<h3>Votre fiche projet est prête.</h3><p>Votre fiche a été générée sur notre serveur sans être enregistrée ni envoyée par email. Téléchargez-la pour la conserver.</p><pre class="project-summary"></pre><button class="button" data-download>Télécharger ma fiche</button><button class="project-reset">Remplir une nouvelle demande</button>';
    success.querySelector('pre').textContent = currentSummary;
    dialogContent.replaceChildren(success);
  } catch (error) {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = error.message;
    form.append(message);
  } finally { button.disabled = false; }
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.06 });
  document.querySelectorAll('.section').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}
