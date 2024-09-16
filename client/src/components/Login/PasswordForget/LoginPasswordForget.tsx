import style from './loginPasswordForget.module.css';
import login_style from '../login.module.css';
import input_style from '../../Recycle/input.module.css';
import Input from '../../Recycle/Input';

export default function LoginPasswordForget() {
    return <main className={login_style.main}>
        <h2 className={login_style.title}>비밀번호 찾기</h2>
        <div className={login_style.subtitle}>입력하신 이메일로 비밀번호 변경 링크를 보내드립니다.</div>

        <Input type='text' className={`${input_style.input} ${style.input}`} placeholder='이메일' />
        <section className={style.btn_container}>
            <button className={style.ok_btn}>확인</button>
        </section>
    </main>;
}