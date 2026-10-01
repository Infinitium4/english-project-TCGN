<?php
declare(strict_types=1);
header('Content-Type: text/html; charset=utf-8');
$resources = json_decode(file_get_contents(__DIR__ . '/../config/resources.json'), true, 512, JSON_THROW_ON_ERROR);
?>
<!doctype html>
<html lang="fr">
<head><?php require __DIR__ . '/../templates/head.php'; ?><script src="assets/app.js" defer></script></head>
<body>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<?php require __DIR__ . '/../templates/header.php'; ?>
<?php require __DIR__ . '/../templates/content.php'; ?>
<?php require __DIR__ . '/../templates/footer.php'; ?>
<dialog aria-labelledby="dialog-title">
  <button class="modal-close" type="button" aria-label="Fermer">×</button>
  <?php require __DIR__ . '/../templates/logo.php'; ?>
  <h2 id="dialog-title"></h2>
  <div id="dialog-content"></div>
</dialog>
<template id="project-template">
  <p>Préparez votre fiche pour définir une formule sur mesure. Aucun déploiement n’est déclenché depuis ce formulaire.</p>
  <?php require __DIR__ . '/../templates/project-form.php'; ?>
</template>
<?php foreach ($resources as $name => $description): ?>
<template data-resource="<?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>">
  <div class="resource-content">
    <p><?= htmlspecialchars($description, ENT_QUOTES, 'UTF-8') ?></p>
    <?php if ($name === 'Connexion'): ?>
      <button class="button" data-explore-dashboard>Explorer le dashboard</button>
    <?php else: ?>
      <button class="button secondary" data-close>Fermer</button>
    <?php endif; ?>
  </div>
</template>
<?php endforeach; ?>
<?php require __DIR__ . '/../templates/dashboard-views.php'; ?>
<?php require __DIR__ . '/../templates/recommendations.php'; ?>
<noscript><p class="container">Les fenêtres et les onglets nécessitent JavaScript. <a href="project.php">Préparer votre fiche projet</a>.</p></noscript>
</body>
</html>
