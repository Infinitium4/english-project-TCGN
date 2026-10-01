import { useState } from 'react';
import { ArrowRight, CheckCircle2, Download } from 'lucide-react';

const services = ['Hébergement cloud', 'Déploiement automatisé', 'IA / LLM / inférence', 'Workloads GPU', 'Copilote DevOps', 'Optimisation des ressources', 'Sécurité et sauvegardes', 'Monitoring', 'Migration cloud'];

export default function ProjectForm() {
  const [summary, setSummary] = useState('');
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary([
      'TCGN — Demande de formule personnalisée',
      `Nom : ${data.get('name')}`,
      `Email : ${data.get('email')}`,
      `Entreprise : ${data.get('company') || 'Non précisée'}`,
      `Projet : ${data.get('project')}`,
      `Services : ${data.getAll('services').join(', ') || 'À définir ensemble'}`,
      `Infrastructure : ${data.get('infrastructure')}`,
      `Échéance : ${data.get('timeline')}`,
      `Budget indicatif : ${data.get('budget') || 'À définir ensemble'}`,
      `Stack : ${data.get('stack') || 'À définir ensemble'}`,
      `Localisation souhaitée : ${data.get('region')}`,
      `Besoins CPU / GPU : ${data.get('compute')}`,
      `Contraintes : ${data.get('constraints') || 'À préciser'}`,
      `Besoins : ${data.get('details')}`,
    ].join('\n'));
  }
  function download() {
    const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TCGN-mon-projet.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (summary) return <div className="success" role="status">
    <CheckCircle2 size={42}/><h3>Votre fiche projet est prête.</h3>
    <p>Voici votre récapitulatif. Ce formulaire de démonstration n’envoie aucune demande : téléchargez votre fiche pour la conserver.</p>
    <pre className="project-summary">{summary}</pre>
    <button className="button" onClick={download}>Télécharger ma fiche <Download size={16}/></button>
    <button className="project-reset" onClick={() => setSummary('')}>Remplir une nouvelle demande</button>
  </div>;
  return <form className="project-form" onSubmit={submit}>
    <div className="form-grid">
      <label>Votre nom<input name="name" required autoComplete="name" placeholder="Alex Martin" maxLength={120}/></label>
      <label>Email professionnel<input name="email" required type="email" autoComplete="email" placeholder="alex@entreprise.fr" maxLength={200}/></label>
      <label>Entreprise <span>(facultatif)</span><input name="company" autoComplete="organization" placeholder="Votre entreprise" maxLength={150}/></label>
      <label>Type de projet<select name="project" required defaultValue=""><option value="" disabled>Sélectionner</option><option>Application SaaS</option><option>API et services backend</option><option>Inférence LLM</option><option>Plateforme IA</option><option>Application cloud-native</option><option>Workload GPU</option><option>Environnement de développement</option><option>Environnement de production</option><option>Autre projet</option></select></label>
    </div>
    <fieldset><legend>Quels services vous intéressent ?</legend><div className="service-options">{services.map(service => <label key={service}><input type="checkbox" name="services" value={service}/>{service}</label>)}</div></fieldset>
    <div className="form-grid">
      <label>Infrastructure actuelle<select name="infrastructure" defaultValue="Nouveau projet"><option>Nouveau projet</option><option>Déjà hébergé dans le cloud</option><option>Serveurs sur site</option><option>À définir ensemble</option></select></label>
      <label>Quand souhaitez-vous démarrer ?<select name="timeline" defaultValue="À définir ensemble"><option>Dès que possible</option><option>Dans 1 à 3 mois</option><option>Dans plus de 3 mois</option><option>À définir ensemble</option></select></label>
    </div>
    <div className="form-grid">
      <label>Stack technique <span>(facultatif)</span><input name="stack" placeholder="Node.js, Python, Docker, modèle LLM…" maxLength={200}/></label>
      <label>Localisation souhaitée<select name="region" defaultValue="À définir ensemble"><option>France</option><option>Union européenne</option><option>À définir ensemble</option></select></label>
    </div>
    <label>Ressources de calcul<select name="compute" defaultValue="À dimensionner ensemble"><option>CPU</option><option>GPU / IA / LLM</option><option>CPU et GPU</option><option>À dimensionner ensemble</option></select></label>
    <label>Budget indicatif <span>(facultatif)</span><input name="budget" placeholder="Votre budget ou « à définir ensemble »" maxLength={150}/></label>
    <label>Contraintes techniques et sécurité <span>(facultatif)</span><textarea name="constraints" rows={2} maxLength={2000} placeholder="Localisation des données, sauvegardes, accès, disponibilité, contraintes de migration…"/></label>
    <label>Parlez-nous de vos besoins<textarea name="details" required rows={4} maxLength={4000} placeholder="Applications à héberger, trafic attendu, stockage, contraintes de sécurité, accompagnement souhaité…"/></label>
    <button className="button" type="submit">Préparer ma demande personnalisée <ArrowRight size={16}/></button>
    <small>Chaque formule est définie après étude de votre projet. Démonstration : aucune donnée n’est envoyée.</small>
  </form>;
}
