import { Link, Route, Routes } from 'react-router-dom';
import SettingGeneric from './Generic';
import style from './setting.module.css';
import SettingPassword from './SettingPassword';
import SettingSecurity from './SettingSecurity';

export default function Setting() {
    return <main className={`screen_container ${style.main}`}>
        <h2 className={style.title}>설정</h2>
        <section className={style.screen}>
            <Menu />
            <Routes>
                <Route path='/' element={<SettingGeneric />} />
                <Route path='/password' element={<SettingPassword />} />
                <Route path='/security' element={<SettingSecurity />} />
                <Route path='/test' element={<><article><h2>테스트 인데요?</h2></article></>} />
            </Routes>
        </section>
    </main>;
}

function Menu() {
    return <article className={style.menu}>
        <Link to="/setting/"><div className={style.active}>일반</div></Link>
        <Link to="/setting/security"><div>개인정보 및 보안</div></Link>
        <Link to="/setting/password"><div>비밀번호 변경</div></Link>
    </article>
}