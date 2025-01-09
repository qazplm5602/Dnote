import { Link } from 'react-router-dom';
import style from '../login.module.css';

import domiIcon from '../../../assets/domi.png';

export default function LoginDomiWebButton() {
    return <Link to={`https://domi.kr/bbs/login.php?url=${location.origin}/api/user/login/domiweb`}>
        <div className={style.domi_web}>
            <img className={style.icon} src={domiIcon} />
            <p className={style.text}><span className={style.web}>도미<span>Web</span></span> 통합 로그인</p>
        </div>
    </Link>
}