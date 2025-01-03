import style from './settingGeneric.module.css';
import input_style from '../Recycle/input.module.css';

import Button from '../Recycle/Button';
import Input from '../Recycle/Input';

import GithubIcon from '../../assets/icons/github.svg';
import EmailIcon from '../../assets/icons/email.svg';
import { useEffect, useState } from 'react';
import { ProfileDTO } from '../UserPage/UserPage';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import Spinner from '../Recycle/Spinner';
import request from '../Utils/request';
import { LoginStateDTO } from '../Redux/LoginStateSlice';
import SettingProfileOption from './AvaterOption/AvaterOption';
import SettingInputField from './InputField/SettingInputField';

export default function SettingGeneric() {
    const user = useSelector<RootState, LoginStateDTO>(v => v.user);
    const [ avater, setAvater ] = useState<string | null>(null);
    const [ profile, setProfile ] = useState<ProfileDTO | null>(null);

    const loadProfile = async function() {
        const result = await request<ProfileDTO>(`profile/${user.id}`);
        setProfile(result.data);
    }

    useEffect(() => {
        if (!user.logined || profile !== null) return;
        
        setAvater(user.avatar);
        loadProfile();
        
    }, [ user, profile ]);

    if (profile === null) {
        return <Loading />;
    }

    return <article className={style.main}>
        <SettingProfileOption avater={avater} setAvatar={setAvater} />
        <SettingInputField title='이름' payload='name' defaultValue={profile.user.name} refresh={true} />
        <SettingInputField title='소개' payload='info' defaultValue={profile.info} blank={true} />
        <LinkOption />
    </article>;
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

function Loading() {
    return <article className={style.main}>
        <Spinner className={style.spinner} />
    </article>;
}