import { ArrowUpRight, MapPin } from 'lucide-react';
import { Logo } from './UI';

const links = [
  { title: 'Plateforme', items: [{ name: 'Cloud autonome', href: '#produits' }, { name: 'LLM DevOps', href: '#solutions' }, { name: 'Serveurs IA', href: '#architecture' }, { name: 'Sécurité', href: '#securite' }] },
  { title: 'Entreprise', items: [{ name: 'Notre approche', href: '#fonctionnement' }, { name: 'Souveraineté', href: '#souverainete' }, { name: 'Carrières' }, { name: 'Contact' }] },
  { title: 'Ressources', items: [{ name: 'Documentation' }, { name: 'API' }, { name: 'Status' }, { name: 'Blog' }] },
  { title: 'Légal', items: [{ name: 'Mentions légales' }, { name: 'Confidentialité' }, { name: 'CGU' }] },
];

export default function Footer({ open }: { open: (kind: string) => void }) {
  return <footer id="ressources" className="container"><div className="footer-top"><div className="footer-brand"><Logo/><p>Le Cloud autonome européen.<br/>Votre code. Votre budget. Votre contrôle.</p><span><MapPin size={12}/> France / Europe · Architecture cible</span></div>
    {links.map(({ title, items }) => <div className="footer-col" key={title}><h3>{title}</h3>{items.map(item => 'href' in item ? <a key={item.name} href={item.href}>{item.name}</a> : <button key={item.name} onClick={() => open(item.name)}>{item.name}</button>)}</div>)}
  </div><div className="footer-bottom"><span>© 2026 TCGN. Projet de présentation.</span><span>Le Cloud autonome européen. <ArrowUpRight size={13}/></span><span>FR / EUROPE</span></div></footer>;
}
