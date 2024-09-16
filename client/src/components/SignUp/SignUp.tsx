import style from './signup.module.css';

import WelcomeImg from '../../assets/welcome.png';
import SignUpAgree from './Agree';
import SignUpForm from './Form';

export default function SignUp() {
    return <main className={`screen_container ${style.main}`}>
        <section className={style.head}>
            <img src={WelcomeImg} />

            <ul>
                <div className={style.title}>환영합니다!</div>
                <div className={style.sub}>아래의 약관을 동의해야 가입할 수 있어요.</div>
            </ul>
        </section>

        {/* <SignUpAgree /> */}
        <SignUpForm />
    </main>
}