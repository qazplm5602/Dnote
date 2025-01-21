import { Link } from "react-router-dom";
import style from './headmenu.module.css';
import IconText from "../IconText";
import RightArrowIcon from '../../../assets/icons/right-arrow.svg';

export default function HeadMenu({ title, menu, to, className }: { title: React.ReactNode, menu: string, to: string, className?: string }) {
    return <section className={(className || '') + ` ${style.main}`}>
        <h2>{title}</h2>
        <Link to={to}>
            <IconText icon={RightArrowIcon} text={menu} />
        </Link>
    </section>
}