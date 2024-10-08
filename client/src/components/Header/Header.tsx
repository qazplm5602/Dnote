import { Link } from 'react-router-dom';
import style from './header.module.css';

import Logo from '../../assets/Dnote.svg'
import SearchIcon from '../../assets/icons/ic-outline-search.svg';
import GearIcon from '../../assets/icons/gear.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import NameTag from '../NameTag/NameTag';
import IconText from '../Recycle/IconText';
// import NameTag from '../NameTag/NameTag';

export default function Header() {
    return <header className={style.main}>
        <Link to="/">
            <img className={style.logo} src={Logo} />
        </Link>
        
        <section className={style.menu}>
            <img className={style.search} src={SearchIcon} />

            <div className={style.line}></div>

            <NameTag />

            {/* <Button className={[style.link_btn].join(' ')} text='로그인' link='/login' />
            <Button className={[style.link_btn, style.register].join(' ')} text='회원가입' link='/signup' /> */}
        </section>

        <AccountMenu />
    </header>;
}

function Button({ text, link, className }: { text: string, link: string, className?: string }) {
    return <Link to={link}>
        <button className={className}>{text}</button>
    </Link>
}

function AccountMenu() {
    return <section className={style.account_menu}>
        <AccountMenuButton icon={GearIcon} text='설정' />
        <AccountMenuButton icon={LogoutIcon} text='로그아웃' />
    </section>;
}

function AccountMenuButton({ href, icon, text }: { href?: string, icon: string, text: string }) {
    return <button><IconText icon={icon} text={text} /></button>
}