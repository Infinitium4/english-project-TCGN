import { ArrowDown, Code2, Wallet, Cpu, GitBranch, Activity, Server, MapPin, Terminal, Bell, History, Settings, Plug, Eye, ShieldCheck } from 'lucide-react';
import { SectionTitle } from './UI';

export function Workflow() {
  const steps = [
    { icon: Code2, title: 'Connectez votre application', text: 'Votre dépôt, votre stack et les services nécessaires.' },
    { icon: Wallet, title: 'Définissez votre budget et vos contraintes', text: 'Localisation, sécurité, capacité et objectifs métier.' },
    { icon: Cpu, title: 'Notre IA analyse vos besoins', text: 'Une proposition de ressources et d’architecture à examiner.' },
    { icon: GitBranch, title: 'La plateforme déploie et supervise', text: 'Un parcours de déploiement et une supervision réunis.' },
    { icon: Activity, title: 'L’infrastructure s’optimise en continu', text: 'Des recommandations et des actions selon les règles que vous validez.' },
  ];
  return <section className="section container" id="fonctionnement"><SectionTitle eyebrow="COMMENT ÇA MARCHE" title="De votre code à une infrastructure autonome." text="Voici mon application et mon budget. Faites fonctionner le reste."/>
    <ol className="workflow">{steps.map(({ icon: Icon, title, text }, index) => <li key={title}><div className="workflow-head"><span>0{index + 1}</span><Icon size={21}/></div><h3>{title}</h3><p>{text}</p></li>)}</ol>
    <p className="demo-note">Parcours cible de la plateforme. Les intégrations et opérations cloud ne sont pas connectées dans cette présentation.</p>
  </section>;
}

export function Architecture() {
  return <section className="section container" id="architecture"><SectionTitle eyebrow="SOUS LE CAPOT" title="Une stack cohérente. Du code au serveur." text="Une couche intelligente relie l’application, l’orchestration et les ressources de calcul."/>
    <div className="architecture-diagram">
      <div className="architecture-entry"><span>CLIENT</span><ArrowDown size={16}/><b><Code2 size={19}/> APPLICATION</b></div>
      <ArrowDown className="architecture-arrow" size={22}/>
      <div className="platform-layer"><div className="platform-heading"><GitBranch size={23}/><h3>PLATEFORME CLOUD AUTONOME</h3><span>CONTRÔLE HUMAIN</span></div><div className="platform-modules">{['LLM DevOps', 'Orchestration', 'Sécurité', 'Monitoring', 'Backup', 'Optimisation'].map(name => <span key={name}>{name}</span>)}</div></div>
      <ArrowDown className="architecture-arrow" size={22}/>
      <div className="compute-layer"><div><Server size={22}/><h3>SERVEURS SPÉCIALISÉS</h3></div><span>CPU</span><span>GPU</span><span>IA / LLM</span></div>
      <ArrowDown className="architecture-arrow" size={22}/>
      <div className="location-layer"><MapPin size={21}/><b>INFRASTRUCTURE FRANÇAISE / EUROPÉENNE</b></div>
    </div><p className="demo-note">Schéma d’architecture cible. La région et les capacités disponibles sont à préciser pour chaque projet.</p>
  </section>;
}

export function TechnicalControl() {
  const capabilities = [{ icon: Terminal, name: 'Logs & métriques', text: 'Comprendre les services et leurs comportements.' }, { icon: Bell, name: 'Alertes & observabilité', text: 'Identifier les événements qui demandent une intervention.' }, { icon: History, name: 'Historique des actions', text: 'Garder la trace des déploiements et des changements.' }, { icon: Settings, name: 'Configuration & déploiements', text: 'Définir les paramètres et les règles d’automatisation.' }, { icon: Plug, name: 'API & intégrations', text: 'Relier la plateforme à vos outils et workflows.' }, { icon: Eye, name: 'Intervention humaine', text: 'Examiner les recommandations et décider des actions.' }];
  return <section className="section container" id="equipes"><SectionTitle eyebrow="POUR LES ÉQUIPES TECHNIQUES" title="L’automatisation sans perdre le contrôle." text="Automatiser les tâches répétitives tout en laissant aux équipes la visibilité et le contrôle nécessaires sur leur infrastructure."/>
    <div className="control-grid">{capabilities.map(({ icon: Icon, name, text }) => <article key={name}><Icon size={22}/><h3>{name}</h3><p>{text}</p></article>)}</div>
    <div className="control-note"><ShieldCheck size={20}/><p>Le cadre prévu : analyse, recommandation, validation et application selon les autorisations définies par votre équipe.</p></div>
  </section>;
}

export function UseCases() {
  return <section className="section container" id="cas-usage"><SectionTitle eyebrow="VOS WORKLOADS, UNE MÊME PLATEFORME" title="Pour ce que vous construisez aujourd’hui. Et demain." text="Des besoins de calcul et d’exploitation différents. Une architecture à dimensionner pour chaque projet."/>
    <div className="usecase-grid">{[
      ['Applications SaaS', 'Déploiement, données et évolution de la charge.'],
      ['Inférence LLM', 'Service de modèles et ressources adaptées à l’inférence.'],
      ['Plateformes IA', 'Services applicatifs et pipelines de traitement.'],
      ['APIs', 'Services backend, supervision et disponibilité.'],
      ['Applications cloud-native', 'Conteneurs, orchestration et services connectés.'],
      ['Workloads GPU', 'Calcul spécialisé selon les besoins du workload.'],
      ['Environnements de développement', 'Configuration et isolation des projets.'],
      ['Environnements de production', 'Déploiements contrôlés et observabilité.'],
    ].map(([title, text]) => <article key={title}><Code2 size={18}/><h3>{title}</h3><p>{text}</p></article>)}</div>
  </section>;
}
