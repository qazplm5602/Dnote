import { UserDTO } from '../LoginState/LoginState';
import style from './nametag.module.css';

import avatarIcon from '../../assets/avatar.svg';
import { Link } from 'react-router-dom';

type Props = {
    className?: string,
    user: UserDTO,
    onClick?: React.MouseEventHandler<HTMLElement>,
    link?: boolean
}

export default function NameTag({ link = true, ...props }: Props) {
    return link ? <Link to={`/user/${props.user.id}`}>
        <NameTagBox {...props} />
    </Link> : <NameTagBox {...props} />;
}

function NameTagBox({ className, onClick, user }: Props) {
    return <section onClick={onClick} className={(className || '') + ` ${style.nametag}`}>
        <img src={getProfileURL(user?.avatar || null)} />
        <span>{user?.name || "--"}</span>
    </section>;
}

export function getProfileURL(id: string | null): string {
    if (id === null) return avatarIcon;
    
    return `/file/avatar/${id}`;
}