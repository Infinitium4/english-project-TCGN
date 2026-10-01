<?php
declare(strict_types=1);
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$method = $_SERVER['REQUEST_METHOD'];
$json = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
$summary = '';
$error = '';
if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    http_response_code(405);
    exit('Méthode non autorisée.');
}
if ($method === 'POST') {
    try {
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
            throw new InvalidArgumentException('Le formulaire est trop volumineux.');
        }
        $schema = require __DIR__ . '/../config/form.php';
        $lines = ['TCGN — Demande de formule personnalisée'];
        foreach ($schema['fields'] as $name => $field) {
            $value = $_POST[$name] ?? '';
            if (!is_string($value) || preg_match('//u', $value) !== 1 || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
                throw new InvalidArgumentException('Champ invalide : ' . $field['label']);
            }
            $value = trim($value);
            if (($field['required'] ?? false) && $value === '') {
                throw new InvalidArgumentException('Veuillez renseigner : ' . $field['label']);
            }
            if (preg_match_all('/./us', $value) > ($field['max'] ?? 200)) {
                throw new InvalidArgumentException('Champ trop long : ' . $field['label']);
            }
            if (isset($field['options']) && !in_array($value, $field['options'], true)) {
                throw new InvalidArgumentException('Choix invalide : ' . $field['label']);
            }
            if ($name === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException('Veuillez renseigner une adresse email valide.');
            }
            $lines[] = $field['label'] . ' : ' . ($value !== '' ? $value : ($field['fallback'] ?? ''));
            if ($name === 'project') {
                $services = $_POST['services'] ?? [];
                if (!is_array($services) || count($services) > count($schema['services'])) {
                    throw new InvalidArgumentException('Liste de services invalide.');
                }
                foreach ($services as $service) {
                    if (!is_string($service) || !in_array($service, $schema['services'], true)) {
                        throw new InvalidArgumentException('Service invalide.');
                    }
                }
                $lines[] = 'Services : ' . ($services ? implode(', ', array_unique($services)) : 'À définir ensemble');
            }
        }
        $summary = implode("\n", $lines);
    } catch (InvalidArgumentException $exception) {
        http_response_code(422);
        $error = $exception->getMessage();
    }
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($error ? ['error' => $error] : ['summary' => $summary], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }
    if ($summary !== '') {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="TCGN-mon-projet.txt"');
        echo $summary;
        exit;
    }
}
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="fr">
<head><?php require __DIR__ . '/../templates/head.php'; ?></head>
<body>
<main class="container" style="max-width:760px;padding-block:40px">
  <?php require __DIR__ . '/../templates/logo.php'; ?>
  <h1 style="font-size:36px">Votre fiche projet</h1>
  <p>Les données sont traitées temporairement pour générer votre fiche, sans enregistrement ni envoi commercial.</p>
  <?php if ($error): ?><p role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
  <?php require __DIR__ . '/../templates/project-form.php'; ?>
  <p><a href="./">Retour au site</a></p>
</main>
</body>
</html>
