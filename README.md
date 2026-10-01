# TCGN — Le Cloud autonome européen

Landing page React, TypeScript et Vite. Le design system existant (logo, boutons, titres, composants sombres et responsive) est conservé. `src/autonomous.css` étend les styles de `src/index.css` pour le nouveau positionnement.

## Développement

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

La compilation statique est générée dans `dist/`.

## Composants

- `Hero` : proposition de valeur et architecture visuelle.
- `Products` : six raisons de choisir cette approche.
- `AutonomousCloud` : workflow, architecture, contrôle DevOps et cas d’usage.
- `DevOpsCopilot` : sélection d’exemples de recommandations structurées.
- `Dashboard` : navigation entre vues sans métriques inventées.
- `Sections` : souveraineté, sécurité, formule sur mesure et CTA final.
- `ProjectForm` : besoins applicatifs, budget, région, CPU/GPU, contraintes et fiche téléchargeable.
- `Navbar`, `Footer`, `UI` : navigation et composants communs.

## Périmètre réel

Ce projet présente une entreprise fictive et une architecture cible. Aucune infrastructure, authentification, API, télémétrie, exécution LLM ou opération de déploiement n’est connectée. Les exemples sont explicitement identifiés. Aucun benchmark, tarif fixe ou chiffre client n’est affiché.

Le formulaire produit réellement un récapitulatif téléchargeable en UTF-8. Les informations restent en mémoire dans la page et ne sont pas transmises ou stockées. Avant de recevoir des demandes commerciales, connecter un service d’envoi avec validation côté serveur et renseigner les informations légales réelles. Avant de revendiquer un hébergement ou un engagement de service, confirmer les opérateurs, régions et capacités disponibles.

Les polices sont chargées depuis Google Fonts avec `display=swap` et des polices de repli. Les animations respectent `prefers-reduced-motion`.

## Vérification navigateur

Avec le serveur de développement lancé :

```sh
npx playwright install chromium
node scripts/verify-site.mjs
```

Le script vérifie six largeurs de 320 à 1440 px, le menu mobile, les ancres, les fenêtres modales, le dashboard, les exemples DevOps et la génération de la fiche projet. Les captures sont écrites dans `artifacts/`, ignoré par Git. Pour un autre serveur, renseigner `TCGN_TEST_URL`.
