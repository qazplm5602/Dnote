import { Link } from 'react-router-dom';
import style from './footer.module.css';

export default function Footer() {
    return <footer className={style.footer_main}>
        <article className={`${style.links} screen_container`}>
            <Link to="https://domi.kr/notice">공지사항</Link>
            <div className={style.line}></div>
            <Link to="https://domi.kr/content/provision">이용약관</Link>
            <div className={style.line}></div>
            <Link to="https://domi.kr/content/privacy">개인정보 처리방침</Link>
        </article>

        <article className='screen_container'>
            <a href="https://domi.kr">
                <img className={style.origin_logo} src="https://domi.kr/img/logo.png" />
            </a>
            <div className={style.copyright}>©domi. All Rights Reserved.</div>
        </article>
    </footer>;
}