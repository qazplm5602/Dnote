import style from './login.module.css';
import Logo from '../../assets/Dnote.svg';
import Input from '../Recycle/Input';
import { Link } from 'react-router-dom';

import AppleIcon from '../../assets/icons/social/apple.svg';
import DiscordIcon from '../../assets/icons/social/discord.svg';
import GoogleIcon from '../../assets/icons/social/google.svg';
import { useState } from 'react';

export default function Login() {
    return <main className={style.main}>
        <h2 className={style.title}>
            <img src={Logo} />
            로그인
        </h2>
        <div className={style.subtitle}>로그인 한번으로 모든 서비스를 이용해보세요!</div>
    
        <IdPasswordSection />

        <div className={style.text_line}>
            <div>다른 방법으로 로그인</div>
        </div>

        <SocialSection />
    </main>;
}

function SocialSection() {
    return <article className={style.social_login}>
        <button>
            <img src={GoogleIcon} />
        </button>
        <button>
            <img src={AppleIcon} />
        </button>
        <button className={style.discord}>
            <img src={DiscordIcon} />
        </button>
    </article>;
}

interface InputData {
    value: string,
    error: boolean,
    text: string
}
const inputInitValue: InputData = { value: "", error: false, text: "" };

function IdPasswordSection() {
    const [email, setEmail] = useState({...inputInitValue});
    const [password, setPassword] = useState({...inputInitValue});

    return <article className={style.login_form}>
        <InputBox type='text' placeholder='이메일' data={email} />
        <InputBox type='password' placeholder='비밀번호' data={password} />

        <Link to="/login/help" className={style.find}>로그인이 안되시나요?</Link>
        
        <button className={style.login}>로그인</button>
    </article>;
}

function InputBox({ type, placeholder, data }: { type: React.HTMLInputTypeAttribute, placeholder?: string, data: InputData }) {
    return <>
        <Input type={type} placeholder={placeholder} className={data.error ? style.error : ''} />
        <div className={style.errorT}>{data.text}</div>
    </>;
}