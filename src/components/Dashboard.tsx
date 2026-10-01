import { useState } from 'react';
import { LayoutDashboard, Server, Sparkles, Settings, ChevronDown, Activity, Terminal, ShieldCheck } from 'lucide-react';
import { SectionTitle, Logo } from './UI';

const tabs = [{ icon: LayoutDashboard, label: 'Vue d’ensemble' }, { icon: Server, label: 'Services' }, { icon: Sparkles, label: 'AI Insights' }, { icon: Settings, label: 'Paramètres' }];

export default function Dashboard() {
  const [period, setPeriod] = useState('24 heures');
  const [tab, setTab] = useState('Vue d’ensemble');
  return <section className="section container" id="dashboard"><SectionTitle eyebrow="VISIBILITÉ ET CONTRÔLE" title="Tout votre cloud. Une seule interface." text="Une vue réunissant services, métriques et recommandations, avec votre équipe aux commandes."/>
    <div className="dashboard"><aside><Logo/><div className="workspace">T <span>Votre workspace<small>Formule sur mesure</small></span><ChevronDown size={14}/></div>
      {tabs.map(({ icon: Icon, label }) => <button className={tab === label ? 'selected' : ''} key={label} onClick={() => setTab(label)} aria-pressed={tab === label}><Icon size={16}/>{label}</button>)}
      <div className="sidebar-bottom">Aperçu sans infrastructure connectée</div>
    </aside><div className="dash-main"><div className="dash-top"><span>Workspace <span>/</span> {tab}</span><span className="outline-label">APERÇU D’INTERFACE</span></div>
      <div className="dash-mobile-tabs" role="group" aria-label="Vues du dashboard">{tabs.map(({ label }) => <button key={label} aria-pressed={tab === label} onClick={() => setTab(label)}>{label}</button>)}</div>
      <div className="dash-heading"><div><h3>{tab}</h3><p>Aucune donnée réelle n’est affichée dans cet aperçu.</p></div>{tab === 'Vue d’ensemble' && <select aria-label="Période des métriques" value={period} onChange={event => setPeriod(event.target.value)}><option>24 heures</option><option>7 jours</option><option>30 jours</option></select>}</div>
      {tab === 'Vue d’ensemble' && <><div className="dash-metrics">{['État des services', 'Budget du projet', 'Ressources CPU / GPU', 'Disponibilité'].map(label => <div key={label}><span>{label}</span><strong>—</strong><small>En attente de connexion</small></div>)}</div><div className="resource-chart empty-telemetry"><div><b>Utilisation des ressources</b><span>{period}</span></div><div className="telemetry-placeholder"><Activity size={30}/><h4>Vos métriques apparaîtront ici</h4><p>CPU, mémoire et GPU sur la période sélectionnée, après connexion d’une infrastructure.</p></div></div><div className="dash-bottom"><ServicePreview/><div className="dash-insight"><span><Sparkles size={15}/> IA DEVOPS</span><h4>De l’observation à la décision.</h4><p>Une présentation de recommandations structurées : analyse, action suggérée et validation humaine.</p><a href="#solutions">Explorer les exemples →</a></div></div></>}
      {tab === 'Services' && <ServicePreview/>}
      {tab === 'AI Insights' && <div className="settings-panel"><Sparkles size={26}/><h3>Recommandations DevOps</h3><p>Les analyses nécessitent des logs et des métriques connectés. Aucun diagnostic réel n’a été exécuté.</p><a className="discover" href="#solutions">Voir les exemples de recommandations →</a></div>}
      {tab === 'Paramètres' && <div className="settings-panel"><Settings size={26}/><h3>Un cadre défini avec votre équipe</h3><p>Région d’hébergement : à définir pour votre projet.</p><p>Budget, sauvegardes et alertes : selon votre formule.</p><p>Automatisations : selon les autorisations validées.</p><div className="control-note"><ShieldCheck size={16}/><p>Aucune configuration n’est modifiée depuis cet aperçu.</p></div></div>}
    </div></div>
  </section>;
}

function ServicePreview() {
  return <div className="services"><div className="table-title"><b>Types de services</b><span>Vue illustrative</span></div>{['Application / API', 'Frontend web', 'Base de données', 'Cache', 'Worker IA / LLM'].map(name => <div className="service-row" key={name}><Server size={15}/><span>{name}</span><small className="not-connected">Non connecté</small></div>)}<div className="service-note"><Terminal size={13}/><span>Logs et événements disponibles après intégration.</span></div></div>;
}
