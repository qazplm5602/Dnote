import { Link, Route, Routes } from 'react-router-dom';
import style from './setting.module.css';

export default function Setting() {
    return <main className={`screen_container ${style.main}`}>
        <h2 className={style.title}>설정</h2>
        <section className={style.screen}>
            <Menu />
            <Routes>
                <Route path='/test' element={<><article><h2>테스트 인데요?</h2></article></>} />
            </Routes>
        </section>
    </main>;
}

function Menu() {
    return <article className={style.menu}>
        <Link to="/setting/test"><div className={style.active}>일반</div></Link>
        <Link to="/setting/test"><div>개인정보 및 보안</div></Link>
        <Link to="/setting/test"><div>비밀번호 변경</div></Link>
    </article>
}