import TestImage from '../../assets/image0.jpg';
import style from './nametag.module.css';

export default function NameTag({ className, onClick }: { className?: string, onClick?: React.MouseEventHandler<HTMLElement> }) {
    return <section onClick={onClick} className={(className || '') + ` ${style.nametag}`}>
        <img src={TestImage} />
        <span>도미</span>
    </section>;
}