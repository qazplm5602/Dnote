import style from './header.module.css';
import { IconButton } from "../Recycle/Button";
import menuIcon from '../../assets/icons/menu.svg';

export default function HeaderMenuButton() {
    return <IconButton icon={menuIcon} className={[style.more]} />;
}