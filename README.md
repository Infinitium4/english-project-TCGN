# TCGN — Site PHP

Site en PHP, HTML, CSS et JavaScript natif. React, TypeScript et Vite ne sont plus nécessaires. PHP affiche les pages et valide le formulaire. Le JavaScript gère le menu mobile, les fenêtres, les onglets et l’affichage de la fiche projet.

## Lancer en local

PHP 8.2 ou supérieur, sans Composer ni base de données :

```sh
php -S 127.0.0.1:8000 -t public
```

Ouvrir http://localhost:8000. Le serveur intégré de PHP sert uniquement au développement.

## Héberger sur votre VM Ubuntu/Debian avec Apache

Installer Apache et PHP :

```sh
sudo apt update
sudo apt install apache2 php libapache2-mod-php
php --version
sudo mkdir -p /var/www/tcgn
```

Copier les dossiers `public`, `templates` et `config` dans `/var/www/tcgn/` avec SCP/SFTP. La structure doit être :

```text
/var/www/tcgn/
├── public/        # Seul dossier accessible sur le web
│   ├── index.php
│   ├── project.php
│   └── assets/
├── templates/     # Vues PHP et HTML
└── config/        # Textes et règles du formulaire
```

Copier également `deploy/apache.conf` sur la VM et l’installer :

```sh
sudo cp deploy/apache.conf /etc/apache2/sites-available/tcgn.conf
sudo chown -R root:www-data /var/www/tcgn
sudo find /var/www/tcgn -type d -exec chmod 755 {} \;
sudo find /var/www/tcgn -type f -exec chmod 644 {} \;
sudo a2ensite tcgn.conf
```

Adapter `ServerName` dans `/etc/apache2/sites-available/tcgn.conf` au domaine de votre VM. Pour une VM dédiée à ce site, désactiver le site Apache par défaut :

```sh
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Ouvrir `http://ADRESSE_IP_VM` ou votre domaine. Autoriser le port 80 dans le pare-feu de la VM et de votre fournisseur si nécessaire. Pour une publication avec un domaine, configurer le DNS vers la VM et HTTPS avant de recueillir des informations personnelles.

Aucune compilation, installation npm, base de données ou permission d’écriture dans les dossiers du site n’est nécessaire en production. `deploy/apache.conf` est un exemple à installer ; il n’est pas appliqué automatiquement à votre VM.

## Fichiers à modifier

- `public/index.php` : composition de la page et fenêtres.
- `templates/content.php` : composition des sections de la page principale.
- `templates/sections/` : sections et textes à modifier.
- `templates/header.php` et `templates/footer.php` : navigation.
- `templates/project-form.php` : formulaire.
- `templates/dashboard-views.php` et `templates/recommendations.php` : vues interactives.
- `config/resources.json` : documentation et informations légales.
- `config/form.php` : choix autorisés et limites des champs.
- `public/project.php` : validation et génération de la fiche projet.
- `public/assets/` : styles et JavaScript natif. Les icônes SVG sont intégrées aux vues.

## Comportement du formulaire

Le formulaire envoie les champs à `project.php` en POST. PHP vérifie les champs obligatoires, l’adresse email, les longueurs et les choix autorisés, puis retourne un récapitulatif UTF-8. La fiche peut être téléchargée. Sans JavaScript, `project.php` affiche un formulaire et renvoie directement le téléchargement.

Cette application n’enregistre pas les demandes et n’envoie aucun email. Les données sont traitées temporairement sur le serveur ; les journaux techniques dépendent de votre configuration Apache. Pour recevoir des demandes commerciales, ajouter une intégration de messagerie ou un stockage adapté. Les polices proviennent de Google Fonts.

TCGN reste une entreprise fictive de présentation. Le dashboard et le copilote sont des démonstrations sans infrastructure, authentification ou LLM connectés. Renseigner les informations réelles sur l’éditeur et l’hébergeur avant publication commerciale.

## Vérification

La vérification navigateur utilise Node.js uniquement comme outil de développement :

```sh
npm install
npx playwright install chromium
php -S 127.0.0.1:8000 -t public
# Dans un autre terminal :
npm test
```

Le test couvre six largeurs de 320 à 1440 px, les ancres, le menu, les fenêtres, les vues du dashboard, les recommandations, la validation PHP, les boutons d’action, le téléchargement et le formulaire sans JavaScript. `TCGN_TEST_URL` permet de tester une autre adresse. Les captures sont écrites dans `artifacts/`.
