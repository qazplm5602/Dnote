    import style from './signup.module.css';

import WelcomeImg from '../../assets/welcome.png';
import SignUpAgree, { AgreeData } from './Agree';
import SignUpForm from './Form';
import { useState } from 'react';

export default function SignUp() {
    const [ agree, setAgree ] = useState<AgreeData>({ tos: false, personal: false, ad: false });
    
    const onNext = function(data: AgreeData) {
        setAgree(data);
    }

    return <main className={`screen_container ${style.main}`}>
        <section className={style.head}>
            <img src={WelcomeImg} />

            <ul>
                <div className={style.title}>환영합니다!</div>
                <div className={style.sub}>아래의 약관을 동의해야 가입할 수 있어요.</div>
            </ul>
        </section>

        {agree.tos && agree.personal ? <SignUpForm /> : <SignUpAgree onNext={onNext} />}
    </main>
}