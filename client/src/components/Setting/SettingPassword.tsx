import Input from '../Recycle/Input';
import style from './settingPassword.module.css';
import style_input from '../Recycle/input.module.css';
import Button from '../Recycle/Button';

export default function SettingPassword() {
    return <article className={style.main}>
        <h3 className={style.title}>비밀번호 변경</h3>

        <div className={style.input_title}>기존 비밀번호</div>
        <InputField />

        <div className={style.input_title}>새 비밀번호</div>
        <InputField />

        <div className={style.input_title}>새 비밀번호 재입력</div>
        <InputField error="새 비밀번호가 일치하지 않습니다." />
    
        <Button className={[style.change_btn]}>변경하기</Button>
    </article>;
}

function InputField({ error }: { error?: string }) {
    const classList = [style_input.input, style.input];

    if (error)
        classList.push(style.error);

    return <section className={style.input_field}>
        <Input type='password' className={classList.join(' ')} />
        {error && <span className={style.error_text}>{error}</span>}
    </section>
}