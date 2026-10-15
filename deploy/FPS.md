# Neon Arena

Le lien `fps.php` ouvre un FPS en vue subjective avec des salons de huit joueurs maximum. Les joueurs rejoignent le même code de salon. Le serveur PHP partage les positions, valide les déplacements, les collisions, les tirs et les éliminations. Quatre impacts éliminent un joueur, qui réapparaît après trois secondes. Les salons inactifs sont remis à zéro au prochain accès après le départ des joueurs.

Depuis le dossier du projet :

```powershell
npm run dev
```

Ouvrir http://localhost:8000/fps.php dans deux onglets pour tester le multijoueur sur un ordinateur.

Pour plusieurs ordinateurs sur le même réseau, arrêter le serveur précédent avec Ctrl+C, puis :

```powershell
npm run dev:lan
```

Les autres joueurs utilisent `http://ADRESSE_IP_DU_PC:8000/fps.php`, puis le même code de salon. Ouvrir le site avec cette adresse réseau avant de copier une invitation. Les autres ordinateurs doivent pouvoir joindre le port 8000 du serveur. Le serveur PHP intégré sert au développement et aux essais sur réseau local.

Pour jouer sur Internet, déployer `public`, `templates` et `config` sur un même serveur PHP 8.2+ accessible en HTTPS. L'API `public/arena-api.php` et `fps.php` doivent être servies par ce même hébergement. Le dossier temporaire PHP doit être accessible en écriture, hors de la racine web. Les salons sont éphémères et utilisent des fichiers verrouillés ; cette version convient à un serveur unique, sans plusieurs réplicas. Les salons sont accessibles à toute personne connaissant leur code, sans compte utilisateur. Le site ne déploie pas automatiquement ce serveur sur Internet.

Commandes : ZQSD/WASD pour se déplacer, souris pour viser, clic ou Espace pour tirer, flèches gauche/droite pour tourner, Échap pour libérer la souris. Commandes tactiles disponibles. Le son s'active avec le bouton Son.

Vérification : `npm run test:fps` teste deux navigateurs, les tirs, les éliminations, la réapparition, les salons, les limites de capacité et l'affichage mobile. Edge est utilisé par défaut ; `TCGN_BROWSER=chromium` sélectionne Chromium si installé. `TCGN_TEST_URL` choisit le serveur testé.
