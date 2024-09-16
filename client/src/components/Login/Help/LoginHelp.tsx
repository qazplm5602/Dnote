import { Link } from 'react-router-dom';
import HeadMenuList from '../../Recycle/HeadMenuList/HeadMenuList';
import style from './loginHelp.module.css';

export default function LoginHelp() {
    return <main className={style.main}>
        <HeadMenuList title='로그인에 어떤 문제가 있나요?' menu='돌아가기' to='/login' className={style.list}>
            <Link to="./forget" className={style.box}>
                <div>비밀번호를 잃어버렸어요.</div>
            </Link>
            <Link to="./email_forget" className={style.box}>
                <div>이메일을 모르겠어요.</div>
            </Link>
            <Link to="/contact" className={style.box}>
                <div>다른 문제가 있나요?</div>
            </Link>
        </HeadMenuList>
    </main>;
}