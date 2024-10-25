import Input from '../Recycle/Input';
import style from './signupForm.module.css';
import input_style from '../Recycle/input.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { validateEmail } from '../Utils/misc';
import request, { ErrorResponse } from '../Utils/request';
import { AxiosError } from 'axios';

type InputData = { value: string, error: string }
const inputInitValue = (): InputData => ({ value: "", error: "" });

export default function SignUpForm() {
    const [ email, setEmail ] = useState<InputData>(inputInitValue());
    const [ password, setPassword ] = useState<InputData>(inputInitValue());
    const [ passwordRe, setPasswordRe ] = useState<InputData>(inputInitValue());
    const [ nickname, setNickname ] = useState<InputData>(inputInitValue());

    const lastEmail = useRef<string>("");

    const [ loading, setLoading ] = useState(false);

    const resetErrorAll = function() {
        setEmail({ ...email, error: '' });
        setPassword({ ...password, error: '' });
        setPasswordRe({ ...passwordRe, error: '' });
        setNickname({ ...nickname, error: '' });
    }

    const onRegisterClick = async function() {
        if (loading) return;

        resetErrorAll();

        let failed = false;

        if (password.value.length === 0) {
            setPassword({ ...password, error: "비밀번호를 입력해야 합니다." });
            failed = true;
        }

        if (passwordRe.value.length === 0) {
            setPasswordRe({ ...password, error: "비밀번호를 재입력해야 합니다." });
            failed = true;
        }
        
        if (password.value !== passwordRe.value) {
            // 이건 이미 입력칸에 오류가 뜨지 않을까??
            failed = true;
        }

        if (!validateEmail(email.value)) {
            // 이건 이미 입력칸에 오류가 뜨지 않을까??
            setEmail({ ...email, value: '.' });
            failed = true;
        }

        if (nickname.value.length === 0) {
            setNickname({ ...nickname, error: "닉네임을 입력해야 합니다." });
            failed = true;
        }

        if (failed) return;
        
        setLoading(true);
        const response = await request("signup", { method: "POST", data: {
            email: email.value,
            password: password.value,
            name: nickname.value
        } }).catch(e => e as AxiosError<ErrorResponse>);

        // 오류남
        if (response instanceof AxiosError) {
            setLoading(false);
            
            if (response.status === 400 && response.response !== undefined) {
                const data = response.response.data;

                switch (data.code) {
                    case "SIGNUP1":
                        console.log(data, data.message);
                        setEmail({ ...email, error: data.message });
                        return;
                
                    default:
                        break;
                }
            }
            
            return;
        }

        // 성공!!!
        // 이메일 인증하라고 다음 페이지에서 해야함
        console.log("완료.");
    }

    // 비번 다름 검사
    useEffect(() => {
        // 입력 했는데 오류 인경우
        if (password.value.length > 0 && password.error !== "")
            setPassword({ ...password, error: "" });

        if (password.value.length === 0 || passwordRe.value.length === 0) return;
        
        const passwordSame = password.value === passwordRe.value;
        if (passwordRe.error !== "") {
            if (passwordSame)
                setPasswordRe({ ...passwordRe, error: "" });

        } else if (!passwordSame) {
            setPasswordRe({ ...passwordRe, error: "비밀번호가 일치하지 않습니다." });
        }
    }, [ password, passwordRe ]);

    // 이메일 형식 확인
    useEffect(() => {
        const changedValue = email.value !== lastEmail.current;
        if (email.value.length === 0) return;
        
        const isValid = validateEmail(email.value);
        if (email.error !== "") {
            if (isValid && changedValue)
                setEmail({ ...email, error: "" });
        } else if (!isValid) {
            setEmail({ ...email, error: "이메일 형식이 아닙니다." });
        }

        lastEmail.current = email.value;
    }, [ email ]);

    // 닉네임
    useEffect(() => {
        if (nickname.error === "") return;

        if (nickname.value.length > 0)
            setNickname({ ...nickname, error: '' });
    }, [ nickname ]);

    return <article className={style.main}>
        <FormInput title='이메일' data={[ email, setEmail ]} />
        <FormInput title='비밀번호' type='password' passCheck={true} data={[ password, setPassword ]} />
        <FormInput title='비밀번호 재입력' type='password' data={[ passwordRe, setPasswordRe ]} />
        <FormInput title='닉네임' sub='다른분들에게 보여질 이름이예요.' data={[ nickname, setNickname ]} />

        <button className={style.register_btn} onClick={onRegisterClick} disabled={loading}>회원가입</button>
        <div className={style.already}>이미 회원이신가요?<Link to="/login">로그인</Link></div>
    </article>;
}

function FormInput({ title, sub, type = 'text', passCheck = false, data: [data, setData] }: { title: string, sub?: string, type?: React.HTMLInputTypeAttribute, passCheck?: boolean, data: [InputData, React.Dispatch<React.SetStateAction<InputData>>] }) {
    const onInputChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setData({ error: data.error, value: e.target.value });
    }
    
    return <section>
        <h3>{title}</h3>
        <div className={style.sub}>{sub}</div>
        <Input type={type} className={`${input_style.input} ${style.input} ${data.error ? style.error : ''}`} onChange={onInputChange} />
        {data.error && <div className={style.errorT}>{data.error}</div>}

        {passCheck && <ProgressBar />}
        {passCheck && <div className={style.sub}>비밀번호 강도</div>}
    </section>;
}

function ProgressBar() {
    return <div className={style.bar}>
        <div className={style.barin}></div>
    </div>
}