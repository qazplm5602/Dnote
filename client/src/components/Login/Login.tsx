import style from './login.module.css';
import Logo from '../../assets/Dnote.svg';
import Input from '../Recycle/Input';
import { Link, useNavigate } from 'react-router-dom';

import AppleIcon from '../../assets/icons/social/apple.svg';
import DiscordIcon from '../../assets/icons/social/discord.svg';
import GoogleIcon from '../../assets/icons/social/google.svg';
import { useState } from 'react';
import { validateEmail } from '../Utils/misc';
import request, { ErrorResponse } from '../Utils/request';
import { AxiosError } from 'axios';

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
    // const navigate = useNavigate();

    const onLogin = async function() {
        // 초기화
        setEmail({ ...email, error: false, text: '' });
        setPassword({ ...password, error: false, text: '' });

        // 확인하기
        let checkFail = false;
        
        if (!validateEmail(email.value)) {
            checkFail = true;
            setEmail({ value: email.value, error: true, text: "이메일 형식이 아닙니다." });
        }

        if (password.value.length <= 0) {
            setPassword({ value: password.value, error: true, text: "비밀번호를 입력해야 합니다." });
        }

        if (checkFail) return; // 실패함

        // 로그인 시도
        const response = await request<any>("user/login", { method: "POST", data: { email: email.value, password: password.value }, withCredentials: true }).catch(e => e as AxiosError<ErrorResponse>);
        if (response instanceof AxiosError) { // 일단 오류남
            let errorText = `서버오류 ${response.status}`;
            
            if (response.status === 403 && response.response !== undefined) {
                errorText = response.response.data.message;
            }

            setEmail(prev => ({ ...prev, error: true }));
            setPassword(prev => ({ ...prev, error: true, text: errorText }));
            return;
        }

        location.href = "/login/success"; // 성공
        //     navigate("/login/success"); // (쿠키가 저장되기전에 해버림 ㅡㅡ)
    }
    
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail({ value: e.currentTarget.value, text: '', error: false });
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword({ value: e.currentTarget.value, text: '', error: false });

    const onEmailBlur = function() {
        if (!validateEmail(email.value))
            setEmail({ value: email.value, error: true, text: "이메일 형식이 아닙니다." });
    }

    return <article className={style.login_form}>
        <InputBox type='text' placeholder='이메일' data={email} onChange={onEmailChange} onBlur={onEmailBlur} />
        <InputBox type='password' placeholder='비밀번호' data={password} onChange={onPasswordChange} />

        <Link to="/login/help" className={style.find}>로그인이 안되시나요?</Link>
        
        <button className={style.login} onClick={onLogin}>로그인</button>
    </article>;
}

function InputBox({ type, placeholder, data, onChange, onBlur }: { type: React.HTMLInputTypeAttribute, placeholder?: string, data: InputData, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, onBlur?: React.FocusEventHandler<HTMLInputElement> }) {
    return <>
        <Input type={type} placeholder={placeholder} className={data.error ? style.error : ''} onChange={onChange} onBlur={onBlur} />
        <div className={style.errorT}>{data.text}</div>
    </>;
}