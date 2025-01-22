import { Link } from 'react-router-dom';
import style from './header.module.css';
import Logo from '../../assets/Dnote.svg'
import { CSSTransition } from 'react-transition-group';

export default function HeaderLogo() {
    return <CSSTransition timeout={300}>
        <Link to="/" className={style.logo_container}>
            <img className={style.logo} src={Logo} />
            <div className={style.beta}>BETA</div>
        </Link>
    </CSSTransition>;
}