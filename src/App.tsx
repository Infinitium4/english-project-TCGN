import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Dashboard from './components/Dashboard';
import DevOpsCopilot from './components/DevOpsCopilot';
import { Workflow, Architecture, TechnicalControl, UseCases } from './components/AutonomousCloud';
import { Security, Sovereignty, Pricing, CTA } from './components/Sections';
import Footer from './components/Footer';
import { Logo } from './components/UI';
import ProjectForm from './components/ProjectForm';

const resourceTexts: Record<string, string> = {
  Connexion: 'Aucun service d’authentification n’est connecté à cette présentation. Vous pouvez explorer les vues du dashboard sans compte ni mot de passe.',
  Documentation: 'Le parcours cible : décrivez votre application et votre budget, précisez les contraintes de localisation et de sécurité, puis examinez une proposition d’architecture. Les intégrations de déploiement ne sont pas connectées à ce site.',
  API: 'Les API et intégrations font partie de l’architecture envisagée. Aucun endpoint public, schéma d’API ou accès de production n’est disponible dans ce projet.',
  Status: 'Aucune infrastructure de production n’est connectée. Ce site ne peut pas confirmer l’état de services cloud réels.',
  Blog: 'Le cloud autonome européen : relier applications, ressources de calcul et exploitation grâce à une couche DevOps intelligente. Le site présente le concept ; aucune publication externe n’est disponible.',
  Carrières: 'Aucune offre de recrutement n’est publiée dans ce projet. Pour évoquer votre profil, vous pouvez préparer une fiche via le formulaire de contact.',
  Confidentialité: 'Les informations saisies dans les formulaires restent dans la mémoire de cette page. Elles ne sont pas envoyées à un serveur ni stockées dans le navigateur. Vous pouvez télécharger volontairement votre fiche. Les polices sont chargées depuis Google Fonts.',
  'Mentions légales': 'TCGN est une entreprise fictive dans ce projet de présentation. Les informations sur l’éditeur, l’hébergeur et les services doivent être renseignées avant une publication commerciale.',
  CGU: 'Ce site présente un concept de plateforme. Il ne fournit pas de service cloud opérationnel, de compte client ou d’engagement de disponibilité. Aucune commande ni aucun paiement n’est effectué.',
};

export default function App() {
  const [modal, setModal] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const project = ['Mon projet', 'Parler à un expert', 'Contact'].includes(modal);
  function open(kind: string) { opener.current = document.activeElement as HTMLElement; setModal(kind === 'Commencer' ? 'Mon projet' : kind); }
  function close() { setModal(''); }
  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
    if (!modal && dialog.current?.open) { dialog.current.close(); opener.current?.focus(); }
  }, [modal]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.06 });
    document.querySelectorAll('.section').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <><a className="skip-link" href="#contenu">Aller au contenu</a><Navbar open={open}/>
    <main id="contenu"><Hero start={() => open('Mon projet')}/><Products/><Workflow/><DevOpsCopilot/><Architecture/><TechnicalControl/><Dashboard/><Sovereignty/><Security/><UseCases/><Pricing start={open}/><CTA start={open}/></main>
    <Footer open={open}/>
    <dialog aria-labelledby="dialog-title" ref={dialog} onCancel={close} onClick={event => { if (event.target === dialog.current) close(); }}>
      <button className="modal-close" onClick={close} aria-label="Fermer"><X/></button><Logo/>
      <h2 id="dialog-title">{modal === 'Mon projet' ? 'Votre application. Vos contraintes.' : modal}</h2>
      {project ? <><p>Préparez votre fiche pour définir une formule sur mesure. Aucun déploiement n’est déclenché depuis ce formulaire.</p><ProjectForm key={modal}/></> : <div className="resource-content"><p>{resourceTexts[modal] || 'Les informations seront précisées selon le périmètre de votre projet.'}</p>{modal === 'Connexion' ? <button className="button" onClick={() => { close(); document.getElementById('dashboard')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}>Explorer le dashboard</button> : <button className="button secondary" onClick={close}>Fermer</button>}</div>}
    </dialog>
  </>;
}
