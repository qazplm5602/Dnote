import { Link } from 'react-router-dom';
import style from './header.module.css';

import Logo from '../../assets/Dnote.svg'
import SearchIcon from '../../assets/icons/ic-outline-search.svg';
// import NameTag from '../NameTag/NameTag';

export default function Header() {
    return <header className={style.main}>
        <img className={style.logo} src={Logo} />
        
        <section className={style.menu}>
            <img className={style.search} src={SearchIcon} />

            <div className={style.line}></div>

            {/* <NameTag /> */}

            <Button className={[style.link_btn].join(' ')} text='로그인' link='/login' />
            <Button className={[style.link_btn, style.register].join(' ')} text='회원가입' link='/signup' />
        </section>
    </header>;
}

function Button({ text, link, className }: { text: string, link: string, className?: string }) {
    return <Link to={link}>
        <button className={className}>{text}</button>
    </Link>
}