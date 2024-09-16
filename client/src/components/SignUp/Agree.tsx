import { useState } from 'react';
import style from './signupAgree.module.css';

export default function SignUpAgree() {
    return <article className={style.main}>
        <CheckLabel id='tos' text="이용약관 동의" need={true} more='뭐' />
        <CheckLabel id='personal' text="개인정보 수집 및 이용 동의" need={true} more='뭐' />
        <CheckLabel id='ad' text="광고성 정보 수신 동의" need={false} more='뭐' />

        <div className={style.line}></div>
        <CheckLabel id='all' text="약관 전체 동의" need={null} />

        <button className={style.next_btn}>다음</button>
    </article>;
}

function CheckLabel({ id, text, need, more }: { id: string, text: string, need: boolean | null, more?: string }) {
    const [active, setActive] = useState(false);
    const onToggle = function() {
        setActive(!active);
    }


    return <div className={style.check_box}>
        <input id={id} type="checkbox" checked={active} onChange={onToggle} />
        <label htmlFor={id}></label>
        <label htmlFor={id}>{text}</label>
        {need !== null && <span className={style.need}>{need ? "필수" : "선택"}</span>}
        
        {more && <button className={style.more}>더보기</button>}
    </div>;
}