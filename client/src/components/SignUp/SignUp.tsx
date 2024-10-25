import style from './signup.module.css';

import WelcomeImg from '../../assets/welcome.png';
import SignUpAgree, { AgreeData } from './Agree';
import SignUpForm from './Form';
import { useMemo, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

export default function SignUp() {
    const [ agree, setAgree ] = useState<AgreeData>({ tos: false, personal: false, ad: false });
    const isNextPage = useMemo(() => agree.tos && agree.personal, [ agree ]);


    const agreeRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLElement>(null);
    const nodeRef = isNextPage ? formRef : agreeRef;
    
    const onNext = function(data: AgreeData) {
        setAgree(data);
    }

    return <main className={`screen_container ${style.main}`}>
        <section className={style.head}>
            <img src={WelcomeImg} />

            <ul>
                <div className={style.title}>환영합니다!</div>
                <div className={style.sub}>{isNextPage ? "이제 거의 다 왔어요! 정보를 기입해주세요." : "아래의 약관을 동의해야 가입할 수 있어요."}</div>
            </ul>
        </section>

        <div className={style.content_wrapper}>
            <SwitchTransition mode='out-in'>
                <CSSTransition
                    key={String(isNextPage)}
                    nodeRef={nodeRef}
                    timeout={300}
                    classNames={{
                        enter: style.enter,
                        enterActive: style.enter_active,
                        exit: style.exit,
                        exitActive: style.exit_active,
                    }}
                    addEndListener={(done: () => void) => {
                        if (nodeRef.current)
                            nodeRef.current.addEventListener("transitionend", done, false);
                    }}
                    unmountOnExit
                >
                    <section ref={nodeRef} className={style.content}>
                        {isNextPage ? <SignUpForm /> : <SignUpAgree onNext={onNext} />}
                    </section>
                </CSSTransition>
            </SwitchTransition>
        </div>
    </main>
}