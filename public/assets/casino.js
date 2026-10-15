'use strict';

(() => {
  const form = document.querySelector('#casino-form');
  if (!form) return;
  const bet = document.querySelector('#casino-bet');
  const spin = document.querySelector('#casino-spin');
  const reset = document.querySelector('#casino-reset');
  const balanceLabel = document.querySelector('#casino-balance');
  const result = document.querySelector('#casino-result');
  const reels = document.querySelector('.casino-reels');
  const symbols = ['7', '★', '◆', '♣', '♥'];
  let balance = 1000;
  let busy = false;
  function render() {
    balanceLabel.textContent = balance.toLocaleString('fr-FR');
    spin.disabled = busy || balance < Number(bet.value);
    bet.disabled = busy;
    reset.disabled = busy;
  }
  bet.addEventListener('change', render);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const stake = Number(bet.value);
    if (busy || ![10, 25, 50, 100].includes(stake) || balance < stake) return;
    busy = true;
    balance -= stake;
    render();
    result.textContent = 'Les rouleaux tournent…';
    reels.classList.add('is-spinning');
    const draw = () => {
      const value = new Uint32Array(1);
      do { crypto.getRandomValues(value); } while (value[0] >= 4294967295);
      return symbols[value[0] % symbols.length];
    };
    const values = Array.from({ length: 3 }, draw);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    [...reels.children].forEach((reel, index) => { reel.textContent = values[index]; });
    reels.setAttribute('aria-label', `Rouleaux : ${values.join(', ')}`);
    reels.classList.remove('is-spinning');
    const distinct = new Set(values).size;
    const multiplier = distinct === 1 ? (values[0] === '7' ? 20 : 8) : distinct === 2 ? 2 : 0;
    const gain = stake * multiplier;
    balance += gain;
    result.textContent = gain ? `${multiplier === 20 ? 'Jackpot ! ' : ''}${gain} jetons remportés !` : 'Pas de combinaison cette fois. La mise est perdue.';
    if (balance < 10) result.textContent += ' Réserve épuisée : recommencez pour rejouer.';
    else if (balance < stake) result.textContent += ' Choisissez une mise plus petite pour continuer.';
    busy = false;
    render();
  });
  reset.addEventListener('click', () => {
    if (busy) return;
    balance = 1000;
    result.textContent = 'Nouvelle partie : 1 000 jetons. À vous de jouer !';
    render();
  });
  render();
})();
