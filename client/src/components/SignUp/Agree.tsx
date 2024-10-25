import { useEffect, useMemo, useState } from 'react';
import style from './signupAgree.module.css';

export interface AgreeData { tos: boolean, personal: boolean, ad: boolean }

export default function SignUpAgree({ onNext }: { onNext: (data: AgreeData) => void }) {
    const [ tos, setTos ] = useState(false);
    const [ personal, setPersonal ] = useState(false);
    const [ ad, setAd ] = useState(false);
    const [ all, setAll ] = useState(false);

    const requireCheck = useMemo(() => tos && personal, [tos, personal]);

    const onNextClick = function() {
        onNext({ tos, personal, ad });
    }

    useEffect(() => {
        // 3개가 다 체크 안되어있는데 전체 동의가 체크된 경우
        // if ((!tos || !personal || !ad) && all) {
        //     setAll(false);
        // } 

        setAll(tos && personal && ad);
    }, [ tos, personal, ad ]);

    useEffect(() => {
        const nonAllCheck = (!tos || !personal || !ad);

        if (all && nonAllCheck) {
            setTos(true);
            setPersonal(true);
            setAd(true);
        } else if (!all && !nonAllCheck) {
            setTos(false);
            setPersonal(false);
            setAd(false);
        }
    }, [ all ]);

    return <article className={style.main}>
        <CheckLabel id='tos' text="이용약관 동의" need={true} more='뭐' state={[ tos, setTos ]} />
        <CheckLabel id='personal' text="개인정보 수집 및 이용 동의" need={true} more='뭐' state={[ personal, setPersonal ]} />
        <CheckLabel id='ad' text="광고성 정보 수신 동의" need={false} more='뭐' state={[ ad, setAd ]} />

        <div className={style.line}></div>
        <CheckLabel id='all' text="약관 전체 동의" need={null} state={[ all, setAll ]} />

        <button className={style.next_btn} disabled={!requireCheck} onClick={onNextClick}>다음</button>
    </article>;
}

function CheckLabel({ id, text, need, more, state }: { id: string, text: string, need: boolean | null, more?: string, state: [ boolean, React.Dispatch<React.SetStateAction<boolean>> ] }) {
    const onToggle = function() {
        state[1](!state[0]);
    }


    return <div className={style.check_box}>
        <input id={id} type="checkbox" checked={state[0]} onChange={onToggle} />
        <label htmlFor={id}></label>
        <label htmlFor={id}>{text}</label>
        {need !== null && <span className={style.need}>{need ? "필수" : "선택"}</span>}
        
        {more && <button className={style.more}>더보기</button>}
    </div>;
}