import { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Logo } from './UI';

export default function Navbar({ open }: { open: (kind: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return <header><div className="nav container"><Logo/><nav id="main-navigation" className={expanded ? 'expanded' : ''} aria-label="Navigation principale">
    {[['Plateforme', 'produits'], ['IA DevOps', 'solutions'], ['Architecture', 'architecture'], ['Souveraineté', 'souverainete'], ['Sur mesure', 'tarifs']].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setExpanded(false)}>{name}</a>)}
  </nav><div className="nav-actions"><button className="login" onClick={() => open('Connexion')}>Connexion</button><button className="nav-start" onClick={() => { setExpanded(false); open('Mon projet'); }}>Mon projet <ArrowUpRight size={15}/></button></div><button className="burger" aria-label={expanded ? 'Fermer le menu' : 'Ouvrir le menu'} aria-controls="main-navigation" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <X/> : <Menu/>}</button></div></header>;
}
