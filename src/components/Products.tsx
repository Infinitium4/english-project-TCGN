import { MapPin, Cpu, Sparkles, Code2, Activity, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { SectionTitle } from './UI';

const benefits = [
  { name: 'Cloud souverain', icon: MapPin, text: 'Une architecture française et européenne, pensée pour garder le contrôle sur vos données et vos workloads.', tag: 'MAÎTRISE DES DONNÉES', href: '#souverainete' },
  { name: 'Serveurs IA', icon: Cpu, text: 'Des serveurs spécialisés pour l’IA, les LLM, l’inférence et les applications nécessitant des capacités de calcul importantes.', tag: 'CPU · GPU · IA / LLM', href: '#architecture' },
  { name: 'DevOps augmenté par l’IA', icon: Sparkles, text: 'Un LLM DevOps conçu pour analyser vos déploiements et votre infrastructure, puis recommander les actions adaptées.', tag: 'ANALYSER · DIAGNOSTIQUER', href: '#solutions' },
  { name: 'Déploiement simplifié', icon: Code2, text: 'Une approche qui relie votre code à une infrastructure opérationnelle, sans configurer manuellement chaque couche.', tag: 'DU CODE À LA PRODUCTION', href: '#fonctionnement' },
  { name: 'Monitoring intelligent', icon: Activity, text: 'Métriques, logs et alertes réunis pour identifier les anomalies et les opportunités d’optimisation.', tag: 'OBSERVER · COMPRENDRE', href: '#dashboard' },
  { name: 'Optimisation des coûts', icon: SlidersHorizontal, text: 'Des ressources et une stratégie de scaling définies selon la charge, vos contraintes et votre budget.', tag: 'VOTRE BUDGET COMME CADRE', href: '#tarifs' },
];

export default function Products() {
  return <section className="section container" id="produits">
    <SectionTitle eyebrow="POURQUOI TCGN" title="Un cloud conçu pour l’ère de l’IA." text="Souveraineté, performance IA et automatisation : une infrastructure pensée comme un ensemble."/>
    <div className="product-grid benefits-grid">{benefits.map(({ name, icon: Icon, text, tag, href }, index) => <a className={`product-card product-${index % 4}`} key={name} href={href}>
      <div className="product-top"><div className="product-icon"><Icon size={24}/></div><ArrowUpRight size={19}/></div>
      <h3>{name}</h3><p>{text}</p><span className="product-tag">{tag}</span><span className="product-link">Découvrir <ArrowUpRight size={14}/></span>
    </a>)}</div>
  </section>;
}
