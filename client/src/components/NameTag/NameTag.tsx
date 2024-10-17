import TestImage from '../../assets/image0.jpg';
import { UserDTO } from '../LoginState/LoginState';
import style from './nametag.module.css';

import avatarIcon from '../../assets/avatar.svg';

export default function NameTag({ className, onClick, user }: { className?: string, user: UserDTO, onClick?: React.MouseEventHandler<HTMLElement> }) {
    return <section onClick={onClick} className={(className || '') + ` ${style.nametag}`}>
        <img src={getProfileURL(user?.avatar || null)} />
        <span>{user?.name || "--"}</span>
    </section>;
}

export function getProfileURL(id: string | null): string {
    if (id === null) return avatarIcon;
    
    return `/file/avatar/${id}`;
}