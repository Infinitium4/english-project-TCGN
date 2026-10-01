import { Network, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
export function Logo(){return <a className="logo" href="#" aria-label="TCGN accueil"><span className="logo-icon" aria-hidden="true"><Network size={23}/></span>TCGN</a>}
export function Button({children,onClick,secondary=false}:{children:ReactNode;onClick?:()=>void;secondary?:boolean}){return <button type="button" className={`button ${secondary?'secondary':''}`} onClick={onClick}>{children}<ArrowUpRight size={16} aria-hidden="true"/></button>}
export function SectionTitle({eyebrow,title,text}:{eyebrow:string;title:string;text?:string}){return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text&&<p>{text}</p>}</div>}
