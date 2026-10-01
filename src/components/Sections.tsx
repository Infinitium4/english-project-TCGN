import { ShieldCheck, LockKeyhole, DatabaseBackup, Radar, Fingerprint, MapPin } from 'lucide-react';
import { SectionTitle, Button } from './UI';

export function Security() {
  const features = [{ icon: LockKeyhole, name: 'Chiffrement des données' }, { icon: DatabaseBackup, name: 'Politique de sauvegarde' }, { icon: Radar, name: 'Monitoring et alertes' }, { icon: Fingerprint, name: 'Détection des anomalies' }];
  return <section className="section container security-section" id="securite">
    <div className="shield-art"><div className="shield-ring"/><ShieldCheck size={140} strokeWidth={.8}/><span><LockKeyhole size={13}/> SÉCURITÉ DÈS LA CONCEPTION</span></div>
    <div><span className="eyebrow">PROTÉGER CHAQUE COUCHE</span><h2>La sécurité fait partie de l’architecture.</h2><p>Une stratégie à définir pour chaque projet : protection des accès, sauvegardes, surveillance et traitement des activités inhabituelles.</p><div className="security-features">{features.map(({ icon: Icon, name }) => <div key={name}><Icon size={19}/><span>{name}</span></div>)}</div><p className="security-detail">Les mécanismes, la rétention et les engagements de service sont précisés dans votre proposition personnalisée.</p></div>
  </section>;
}

export function Sovereignty() {
  return <section className="section container" id="souverainete"><div className="sovereignty-panel"><div><span className="eyebrow">LE CLOUD AUTONOME EUROPÉEN</span><h2>Vos données. Votre infrastructure. Votre contrôle.</h2><p>Une infrastructure pensée pour les exigences des entreprises européennes, avec un ancrage en France et en Europe et une volonté de réduire la dépendance aux hyperscalers non européens.</p><p>La localisation, les opérateurs, les accès et le périmètre des services doivent être explicités pour votre projet. Aucune certification ou conformité réglementaire n’est revendiquée ici.</p></div><div className="sovereignty-points">{[{ icon: MapPin, title: 'France / Europe', text: 'Une architecture cible avec hébergement européen.' }, { icon: LockKeyhole, title: 'Maîtrise des données', text: 'Localisation et conditions de traitement à préciser.' }, { icon: ShieldCheck, title: 'Sécurité & transparence', text: 'Un périmètre de protection et des responsabilités explicites.' }, { icon: Fingerprint, title: 'Contrôle de l’infrastructure', text: 'Des choix techniques et des autorisations maîtrisés.' }].map(({ icon: Icon, title, text }) => <article key={title}><Icon size={22}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>;
}

export function Pricing({ start }: { start: (kind: string) => void }) {
  return <section className="section container" id="tarifs"><SectionTitle eyebrow="VOTRE APPLICATION. VOTRE BUDGET." title="Une formule pour votre projet, pas un prix standard." text="Les ressources, les services et l’accompagnement sont définis selon vos besoins et vos contraintes."/><div className="pricing-grid">{[{ step: '01', title: 'Décrivez votre application', text: 'Stack, workloads IA ou LLM, trafic et objectifs : précisez votre environnement.' }, { step: '02', title: 'Fixez vos contraintes', text: 'Budget, localisation, sécurité, GPU et calendrier : définissons le cadre ensemble.' }, { step: '03', title: 'Construisons votre formule', text: 'Une proposition d’architecture, un périmètre de services et un budget à valider ensemble.' }].map(item => <div className="price-card custom-offer" key={item.step}><span className="eyebrow">ÉTAPE {item.step}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div><div className="enterprise custom-enterprise"><div><h3>Voici mon application et mon budget.</h3><p>Préparez votre fiche projet pour définir une infrastructure adaptée.</p></div><Button onClick={() => start('Mon projet')}>Décrire mon projet</Button></div></section>;
}

export function CTA({ start }: { start: (kind: string) => void }) {
  return <section className="cta container"><span className="eyebrow">MOINS DE COMPLEXITÉ. PLUS DE CONTRÔLE.</span><h2>Votre application mérite mieux qu’une infrastructure compliquée.</h2><p>Donnez-nous votre application et vos contraintes. Nous vous aidons à construire l’infrastructure adaptée.</p><div><Button onClick={() => start('Mon projet')}>Commencer un déploiement</Button><Button secondary onClick={() => start('Parler à un expert')}>Parler à un expert</Button></div></section>;
}
