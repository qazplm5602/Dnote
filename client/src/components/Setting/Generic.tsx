import style from './settingGeneric.module.css';
import input_style from '../Recycle/input.module.css';

import Avater from '../../assets/image0.jpg';
import Button from '../Recycle/Button';
import Input from '../Recycle/Input';

import GithubIcon from '../../assets/icons/github.svg';
import EmailIcon from '../../assets/icons/email.svg';

export default function SettingGeneric() {
    return <article className={style.main}>
        <ProfileOption />
        <InputField title='이름' />
        <InputField title='소개' />
        <LinkOption />
    </article>;
}

function ProfileOption() {
    return <section className={style.profile}>
        <h3>프로필 이미지</h3>

        <section className={style.group}>
            <img className={style.avater} src={Avater} />
            <Button className={[style.upload_btn]}>업로드<span>권장 사이즈 512x512</span></Button>
        </section>
    </section>;
}

function InputField({ title }: { title: string }) {
    return <section className={style.input_field}>
        <h3>{title}</h3>
        
        <section className={style.in}>
            <Input type='text' className={input_style.input} />
            <Button className={[style.btn]}>변경하기</Button>
        </section>
    </section>
}

function LinkOption() {
    return <section className={style.link_screen}>
        <h3>연동</h3>

        <LinkInput icon={GithubIcon} placeholder="Github 아이디를 입력하세요. ex) qazplm5602" />
        <LinkInput icon={EmailIcon} placeholder="Email을 입력하세요." />

        <Button className={[style.save_btn]}>저장</Button>
    </section>;
}

function LinkInput({ icon, placeholder }: { icon: string, placeholder?: string }) {
    return <div className={style.field}>
        <img src={icon} />
        <Input type='text' placeholder={placeholder} className={input_style.input} />
    </div>;
}