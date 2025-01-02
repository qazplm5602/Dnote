import { Link, Route, Routes, useLocation } from 'react-router-dom';
import SettingGeneric from './Generic';
import style from './setting.module.css';
import SettingPassword from './SettingPassword';
import SettingSecurity from './SettingSecurity';

export default function Setting() {
    return <main className={style.main}>
        <h2 className={`screen_container ${style.title}`}>설정</h2>
        <section className={`screen_container ${style.screen}`}>
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

const menuList = [
    ['', '일반'],
    ['security', '개인정보 및 보안'],  
    ['password', '비밀번호 변경']  
];

function checkUrl(url: string, id: string) {
    const regex = new RegExp(`^\\/setting\\/${id}\\/?$`);
    return regex.test(url);
}

function Menu() {
    const { pathname } = useLocation();

    return <article className={style.menu}>
        {menuList.map(v => <Link key={v[0]} to={`/setting/${v[0]}`}><div className={checkUrl(pathname, v[0]) ? style.active : ''}>{v[1]}</div></Link>)}
    </article>
}