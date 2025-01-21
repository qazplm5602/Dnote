import style from './header.module.css';
import { IconButton } from "../Recycle/Button";
import menuIcon from '../../assets/icons/menu.svg';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setMenuShow } from '../Redux/ContextMenuStateSlice';
import { useNavigate } from 'react-router-dom';

export default function HeaderMenuButton() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onMenuShow = function() {
        if (btnRef.current === null) return;

        const pos = {
            top: btnRef.current.offsetTop + 15,
            left: btnRef.current.offsetLeft - 150
        };
        const menus = [
            { text: "로그인", callback: () => navigate("/login") },
            { text: "회원가입", callback: () => location.href = "https://domi.kr/bbs/register.php" }
        ];

        dispatch(setMenuShow({
            menus,
            pos
        }));
    }

    return <IconButton icon={menuIcon} className={[style.more]} domiRef={btnRef} onClick={onMenuShow} />;
}