import TestImage from '../../assets/image0.jpg';
import style from './nametag.module.css';

export default function NameTag({ className }: { className?: string }) {
    return <section className={(className || '') + ` ${style.nametag}`}>
        <img src={TestImage} />
        <span>도미</span>
    </section>;
}