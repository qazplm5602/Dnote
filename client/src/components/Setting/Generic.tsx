import style from './settingGeneric.module.css';


import { useEffect, useState } from 'react';
import { ProfileDTO, SocialDTO } from '../UserPage/UserPage';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import Spinner from '../Recycle/Spinner';
import request from '../Utils/request';
import { LoginStateDTO } from '../Redux/LoginStateSlice';
import SettingProfileOption from './AvaterOption/AvaterOption';
import SettingInputField from './InputField/SettingInputField';
import SettingLinkOption from './LinkOption/LinkOption';

export default function SettingGeneric() {
    const user = useSelector<RootState, LoginStateDTO>(v => v.user);
    const [ avater, setAvater ] = useState<string | null>(null);
    const [ profile, setProfile ] = useState<ProfileDTO | null>(null);

    const loadProfile = async function() {
        const result = await request<ProfileDTO>(`profile/${user.id}`);
        setProfile(result.data);
    }
    const onChangeSocial = function(data: SocialDTO) {
        if (profile !== null)
            setProfile({ ...profile, social: data });
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
        <SettingLinkOption defaultValue={profile.social} onChangeSocial={onChangeSocial} />
    </article>;
}

function Loading() {
    return <article className={style.main}>
        <Spinner className={style.spinner} />
    </article>;
}