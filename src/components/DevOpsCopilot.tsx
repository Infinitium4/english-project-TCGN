import { useState } from 'react';
import { Terminal, ArrowRight, FileSearch, SlidersHorizontal, ShieldCheck } from 'lucide-react';

const scenarios = [
  { prompt: 'Analyse mon infrastructure', observation: 'Cartographier les services, leurs dépendances et les ressources configurées.', recommendation: 'Examiner les points de saturation, les dépendances critiques et la couverture de sauvegarde.', action: 'Définir un plan de changements avec l’équipe avant toute application.' },
  { prompt: 'Pourquoi mon application est-elle lente ?', observation: 'Mettre en relation la latence, les logs applicatifs et les métriques des services.', recommendation: 'Vérifier les requêtes de base de données, les files d’attente et les ressources de calcul.', action: 'Valider le diagnostic avant de modifier la configuration ou de redimensionner.' },
  { prompt: 'Optimise mes ressources GPU', observation: 'Étudier le type de modèle, la mémoire nécessaire et l’utilisation des GPU.', recommendation: 'Comparer le dimensionnement, le batching et les options d’inférence adaptés au workload.', action: 'Tester les changements sur un environnement séparé avant leur déploiement.' },
  { prompt: 'Réduis mes coûts sans dégrader les performances', observation: 'Identifier les ressources peu utilisées et les contraintes de performance.', recommendation: 'Proposer un ajustement de capacité et des règles de scaling respectant le budget.', action: 'Faire valider les compromis et surveiller leurs effets après application.' },
  { prompt: 'Prépare le déploiement de cette nouvelle version', observation: 'Examiner les dépendances, la configuration et les prérequis de la nouvelle version.', recommendation: 'Préparer les vérifications, la stratégie de déploiement et le retour arrière.', action: 'Soumettre le plan de déploiement à la validation de votre équipe.' },
  { prompt: 'Détecte les anomalies des dernières 24 heures', observation: 'Croiser les événements, les logs et les métriques de la période à analyser.', recommendation: 'Regrouper les signaux inhabituels et prioriser les vérifications.', action: 'Présenter les éléments de diagnostic avant toute remédiation.' },
];

export default function DevOpsCopilot() {
  const [selected, setSelected] = useState(0);
  const scenario = scenarios[selected];
  return <section className="section ai-section container copilot-section" id="solutions">
    <div><span className="eyebrow">UNE COUCHE INTELLIGENTE, AU CŒUR DU CLOUD</span><h2>Votre infrastructure a désormais un copilote.</h2><p>Notre LLM spécialisé DevOps est conçu pour comprendre votre application et son infrastructure, afin de vous aider à déployer, surveiller, diagnostiquer et optimiser votre environnement cloud.</p><p>Il observe les services, analyse les logs et recommande des changements. Les automatisations s’inscrivent dans les règles et autorisations de votre équipe.</p><div className="copilot-scope"><span>Diagnostic</span><span>Scaling</span><span>Disponibilité</span><span>Sécurité</span></div></div>
    <div className="copilot-terminal"><div className="terminal-top"><span><Terminal size={16}/> TCGN / DEVOPS COPILOT</span><span className="outline-label">EXEMPLES</span></div>
      <p className="terminal-description">Explorez des recommandations types. Aucun LLM n’est connecté.</p>
      <div className="scenario-list" role="group" aria-label="Exemples de demandes DevOps">{scenarios.map(({ prompt }, index) => <button key={prompt} aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span aria-hidden="true">&gt;</span>{prompt}<ArrowRight size={13}/></button>)}</div>
      <div className="recommendation" aria-live="polite"><div className="recommendation-label">PARCOURS D’ANALYSE ENVISAGÉ</div>{[{ icon: FileSearch, label: 'Analyse', text: scenario.observation }, { icon: SlidersHorizontal, label: 'Recommandation', text: scenario.recommendation }, { icon: ShieldCheck, label: 'Contrôle', text: scenario.action }].map(({ icon: Icon, label, text }) => <div className="recommendation-row" key={label}><Icon size={16}/><div><b>{label}</b><p>{text}</p></div></div>)}</div>
    </div>
  </section>;
}
