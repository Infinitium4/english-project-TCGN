<?php
declare(strict_types=1);

return [
    'fields' => [
        'name' => ['label' => 'Nom', 'max' => 120, 'required' => true],
        'email' => ['label' => 'Email', 'max' => 200, 'required' => true],
        'company' => ['label' => 'Entreprise', 'max' => 150, 'fallback' => 'Non précisée'],
        'project' => ['label' => 'Projet', 'required' => true, 'options' => ['Application SaaS', 'API et services backend', 'Inférence LLM', 'Plateforme IA', 'Application cloud-native', 'Workload GPU', 'Environnement de développement', 'Environnement de production', 'Autre projet']],
        'infrastructure' => ['label' => 'Infrastructure', 'required' => true, 'options' => ['Nouveau projet', 'Déjà hébergé dans le cloud', 'Serveurs sur site', 'À définir ensemble']],
        'timeline' => ['label' => 'Échéance', 'required' => true, 'options' => ['Dès que possible', 'Dans 1 à 3 mois', 'Dans plus de 3 mois', 'À définir ensemble']],
        'budget' => ['label' => 'Budget indicatif', 'max' => 150, 'fallback' => 'À définir ensemble'],
        'stack' => ['label' => 'Stack', 'max' => 200, 'fallback' => 'À définir ensemble'],
        'region' => ['label' => 'Localisation souhaitée', 'required' => true, 'options' => ['France', 'Union européenne', 'À définir ensemble']],
        'compute' => ['label' => 'Besoins CPU / GPU', 'required' => true, 'options' => ['CPU', 'GPU / IA / LLM', 'CPU et GPU', 'À dimensionner ensemble']],
        'constraints' => ['label' => 'Contraintes', 'max' => 2000, 'fallback' => 'À préciser'],
        'details' => ['label' => 'Besoins', 'max' => 4000, 'required' => true],
    ],
    'services' => ['Hébergement cloud', 'Déploiement automatisé', 'IA / LLM / inférence', 'Workloads GPU', 'Copilote DevOps', 'Optimisation des ressources', 'Sécurité et sauvegardes', 'Monitoring', 'Migration cloud'],
];
