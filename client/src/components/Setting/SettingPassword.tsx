import Input from '../Recycle/Input';
import style from './settingPassword.module.css';
import style_input from '../Recycle/input.module.css';
import { SpinnerButton } from '../Recycle/Button';
import { useEffect, useMemo, useState } from 'react';

export default function SettingPassword() {
    const [ password, setPassword ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ renewPassword, setRenewPassword ] = useState("");

    const [ loading, setLoading ] = useState(false);
    const [ wrongError, setWrongError ] = useState(false);
    const [ otherError, setOtherError ] = useState(false);

    const validate = useMemo(() => (password.length > 0 && newPassword.length > 0 && newPassword === renewPassword), [ password, newPassword, renewPassword ]);

    // 비번 변경 요청
    const onChangeClick = function() {
        if (!validate) return; // 잘못된 값이 있는듯

        setLoading(true);

        // ...
    }

    // 기존 비번 입력 바뀌면 오류 해제
    useEffect(() => {
        if (wrongError)
            setWrongError(false);
    }, [ password ]);

    // 새 비밀번호가 다른지 확인
    useEffect(() => {
        setOtherError((newPassword !== "" || renewPassword !== "") && newPassword !== renewPassword);
    }, [ newPassword, renewPassword ]);

    return <article className={style.main}>
        <h3 className={style.title}>비밀번호 변경</h3>

        <div className={style.input_title}>기존 비밀번호</div>
        <InputField value={password} setValue={setPassword} error={wrongError ? "새 비밀번호가 일치하지 않습니다." : undefined} />

        <div className={style.input_title}>새 비밀번호</div>
        <InputField value={newPassword} setValue={setNewPassword} />

        <div className={style.input_title}>새 비밀번호 재입력</div>
        <InputField error={otherError ? "새 비밀번호가 일치하지 않습니다." : undefined} value={renewPassword} setValue={setRenewPassword} />
    
        <SpinnerButton className={[style.change_btn]} loading={loading} onClick={onChangeClick} disabled={!validate}>변경하기</SpinnerButton>
    </article>;
}

function InputField({ error, value, setValue }: { error?: string, value: string, setValue: React.Dispatch<React.SetStateAction<string>> }) {
    const classList = [style_input.input, style.input];

    if (error)
        classList.push(style.error);

    const onChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    return <section className={style.input_field}>
        <Input type='password' className={classList.join(' ')} value={value} onChange={onChange} />
        {error && <span className={style.error_text}>{error}</span>}
    </section>
}