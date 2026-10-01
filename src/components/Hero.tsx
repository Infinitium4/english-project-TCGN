import { ArrowDown, ArrowRight, Code2, Cloud, Server, Cpu, Activity, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from './UI';

const layers = [
  { icon: Code2, name: 'APPLICATION', detail: 'Votre code · Votre budget' },
  { icon: Cloud, name: 'CLOUD AUTONOME', detail: 'Orchestration · Déploiement' },
  { icon: Server, name: 'INFRASTRUCTURE', detail: 'CPU · GPU · Workloads IA' },
  { icon: Cpu, name: 'IA DEVOPS', detail: 'Analyse · Diagnostic · Recommandations' },
  { icon: Activity, name: 'MONITORING + OPTIMISATION', detail: 'Observabilité · Sauvegardes · Scaling' },
];

export default function Hero({ start }: { start: () => void }) {
  return <>
    <section className="hero container autonomous-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <a className="announcement" href="#souverainete"><span>CLOUD SOUVERAIN</span> FRANCE / EUROPE <ArrowRight size={14}/></a>
        <h1 id="hero-title">Le cloud européen qui fait fonctionner votre <span>infrastructure.</span></h1>
        <p>Déployez votre application. Donnez-nous votre budget. Notre plateforme est conçue pour prendre en charge le reste : infrastructure, sécurité, IA, monitoring et optimisation.</p>
        <div className="hero-buttons"><Button onClick={start}>Déployer mon application</Button><a className="discover" href="#fonctionnement">Découvrir la plateforme <ArrowRight size={16}/></a></div>
        <div className="hero-note"><ShieldCheck size={13}/> Votre code. Vos contraintes. Une formule sur mesure.</div>
      </div>
      <div className="architecture-preview" aria-label="Architecture du cloud autonome">
        <div className="architecture-preview-top"><span>TCGN / CLOUD AUTONOME</span><span className="outline-label">ARCHITECTURE CIBLE</span></div>
        <ol className="hero-layers">{layers.map(({ icon: Icon, name, detail }, index) => <li key={name}>
          <div className={`hero-layer layer-${index}`}><span className="layer-icon"><Icon size={21}/></span><div><strong>{name}</strong><small>{detail}</small></div><span className="layer-number">0{index + 1}</span></div>
          {index < layers.length - 1 && <ArrowDown className="layer-arrow" size={16} aria-hidden="true"/>}
        </li>)}</ol>
        <div className="architecture-preview-foot"><MapPin size={13}/> Infrastructure française / européenne</div>
      </div>
    </section>
    <div className="hero-stats container positioning-pillars">{[['France / Europe', 'Une architecture pensée pour la maîtrise des données'], ['IA & LLM', 'Des serveurs spécialisés pour vos workloads'], ['Cloud autonome', 'L’automatisation sous votre contrôle']].map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <section className="tech container" aria-label="Technologies de vos projets"><p>UNE APPROCHE CLOUD-NATIVE, PENSÉE POUR VOTRE STACK</p><div>{['Docker', 'Kubernetes', 'GitHub', 'GitLab', 'PostgreSQL', 'Node.js', 'Python', 'Redis'].map(name => <span key={name}>{name}</span>)}</div></section>
  </>;
}
