import style from './signup.module.css';

import WelcomeImg from '../../assets/welcome.png';
import SignUpAgree, { AgreeData } from './Agree';
import SignUpForm from './Form';
import { useMemo, useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import SignUpWelcome from './Welcome';

interface SignUpData extends AgreeData {
    finish: string
}

enum Page {
    Agree = 0,
    Form,
    Welcome
}

const subTextList = [ "이제 거의 다 왔어요! 정보를 기입해주세요.", "아래의 약관을 동의해야 가입할 수 있어요.", "어서오세요! 이제부터 Dnote를 사용해보세요." ]

export default function SignUp() {
    const [ agree, setAgree ] = useState<SignUpData>({ tos: false, personal: false, ad: false, finish: '' });
    const hasPage = useMemo(() => {
        if (agree.finish !== '') return Page.Welcome;
        if (agree.tos && agree.personal) return Page.Form;

        return Page.Agree;
    }, [ agree ]);

    const refs = {
        [Page.Agree]: useRef<HTMLElement>(null),
        [Page.Form]: useRef<HTMLElement>(null),
        [Page.Welcome]: useRef<HTMLElement>(null),
    }
    const nodeRef = refs[hasPage];
    
    const onNext = function(data: AgreeData) {
        setAgree({ ...data, finish: '' });
    }

    const onComplete = function(name: string) {
        setAgree({ ...agree, finish: name });
    }

    return <main className={`screen_container ${style.main}`}>
        <section className={style.head}>
            <img src={WelcomeImg} />

            <ul>
                <div className={style.title}>환영합니다!</div>
                <div className={style.sub}>{subTextList[hasPage]}</div>
            </ul>
        </section>

        <div className={style.content_wrapper}>
            <SwitchTransition mode='out-in'>
                <CSSTransition
                    key={hasPage}
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
                        {hasPage === Page.Agree && <SignUpAgree onNext={onNext} />}
                        {hasPage === Page.Form && <SignUpForm onComplete={onComplete} />}
                        {hasPage === Page.Welcome && <SignUpWelcome name={agree.finish} />}
                    </section>
                </CSSTransition>
            </SwitchTransition>
        </div>
    </main>
}