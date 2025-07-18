import { CSSTransition } from "react-transition-group";
import { Link } from 'react-router-dom';
import style from './header.module.css';

import GearIcon from '../../assets/icons/gear.svg';
import LogoutIcon from '../../assets/icons/logout.svg';
import UserIcon from '../../assets/icons/user.svg';
import PenIcon from '../../assets/icons/ic-round-create-black.svg';

import NameTag from '../NameTag/NameTag';
import IconText from '../Recycle/IconText';
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { LoginState } from "../Redux/LoginStateSlice";
import HeaderSearch from "./Search";
import { useScreenWidth } from "../Recycle/ScreenWidth/ScreenWidth";
import HeaderMenuButton from "./Menu";
import HeaderLogo from "./Logo";
import HeaderShortSearch from "./ShortSearch";

export default function Header() {
    const user = useSelector<RootState, LoginState>(v => v.user);
    const small = useScreenWidth(700);
    const [ shortSearch, setShortSearch ] = useState(false);

    const showGuestMenu = useMemo(() => !user.logined && !small, [ user, small ]);

    const [ menuShow, setMenuShow ] = useState(false);
    const onNameClick = function(e: React.MouseEvent) {
        setMenuShow(!menuShow);
        e.stopPropagation();
    }

    const onSearchClick = function() {
        if (small)
            setShortSearch(true);
    }
    const onShortSearchBlur = function() {
        setShortSearch(false);
    }

    useEffect(() => {
        if (!menuShow) return; // 안열려있으면 아무것도 하지망

        const bodyClick = function() {
            setMenuShow(false);
        }
        
        document.addEventListener('click', bodyClick);
        return () => document.removeEventListener('click', bodyClick);
    }, [menuShow]);

    useEffect(() => {
        if (!small && shortSearch)
            setShortSearch(false);
    }, [small]);

    return <header className={`${style.main} ${shortSearch ? style.short_search : ''}`}>
        {!shortSearch && <>
            <HeaderLogo />
            
            <section className={style.menu}>
                {/* <img className={style.search} src={SearchIcon} /> */}
                <HeaderSearch onClick={onSearchClick} lock={small} />

                <div className={style.line}></div>

                {user.logined && <NameTag onClick={onNameClick} user={{ id: -1, avatar: user.avatar, name: user.name }} link={false} />}

                {showGuestMenu && <Button className={[style.link_btn].join(' ')} text='로그인' link='/login' />}
                {showGuestMenu && <Button className={[style.link_btn, style.register].join(' ')} text='회원가입' link='https://domi.kr/bbs/register.php' />}
                {!user.logined && !showGuestMenu && <HeaderMenuButton />}
            </section>

            <AccountMenu show={menuShow} />
        </>}

        <HeaderShortSearch active={shortSearch} onClose={onShortSearchBlur} />
    </header>;
}

function Button({ text, link, className }: { text: string, link: string, className?: string }) {
    return <Link to={link}>
        <button className={className}>{text}</button>
    </Link>
}

function AccountMenu({ show }: { show: boolean }) {
    const userId = useSelector<RootState, number>(v => v.user?.id);
    const ref = useRef(null);

    return <CSSTransition in={show} nodeRef={ref} classNames={{enter: style.enter, enterActive: style.enter_active, exitActive: style.exit_active, exit: style.exit}} timeout={300} unmountOnExit>
        <section ref={ref} className={style.account_menu}>
            <AccountMenuButton icon={PenIcon} text='글 쓰기' href={`/write`} />
            <AccountMenuButton icon={UserIcon} text='나의 프로필' href={`/user/${userId}`} />
            <AccountMenuButton icon={GearIcon} text='설정' href="/setting/" />
            <AccountMenuButton icon={LogoutIcon} text='로그아웃' href="/logout" />
        </section>
    </CSSTransition>;
}

function AccountMenuButton({ href, icon, text }: { href: string, icon: string, text: string }) {
    return <Link to={href}><IconText icon={icon} text={text} style={{fill: "red"}} /></Link>
}