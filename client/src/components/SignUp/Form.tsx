import Input from '../Recycle/Input';
import style from './signupForm.module.css';
import input_style from '../Recycle/input.module.css';
import { Link } from 'react-router-dom';

export default function SignUpForm() {
    return <article className={style.main}>
        <FormInput title='이메일' />
        <FormInput title='비밀번호' type='password' passCheck={true} />
        <FormInput title='비밀번호 재입력' type='password' />
        <FormInput title='닉네임' sub='다른분들에게 보여질 이름이예요.' />

        <button className={style.register_btn}>회원가입</button>
        <div className={style.already}>이미 회원이신가요?<Link to="/login">로그인</Link></div>
    </article>;
}

function FormInput({ title, sub, type = 'text', passCheck = false }: { title: string, sub?: string, type?: React.HTMLInputTypeAttribute, passCheck?: boolean }) {
    return <section>
        <h3>{title}</h3>
        <div className={style.sub}>{sub}</div>
        <Input type={type} className={`${input_style.input} ${style.input}`} />

        {passCheck && <ProgressBar />}
        {passCheck && <div className={style.sub}>비밀번호 강도</div>}
    </section>;
}

function ProgressBar() {
    return <div className={style.bar}>
        <div className={style.barin}></div>
    </div>
}