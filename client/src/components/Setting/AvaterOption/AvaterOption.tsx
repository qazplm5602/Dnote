import { getProfileURL } from '../../NameTag/NameTag';
import Button from '../../Recycle/Button';
import style from '../settingGeneric.module.css';
import AvatarEditor from 'react-avatar-editor'
import SettingAvatarEdit from './AvatarEdit';

type Props = {
    avater: string | null
};
export default function SettingProfileOption({ avater }: Props) {
    return <section className={style.profile}>
    <h3>프로필 이미지</h3>

    <section className={style.group}>
        <img className={style.avater} src={getProfileURL(avater)} />
        <Button className={[style.upload_btn]}>업로드<span>권장 사이즈 512x512</span></Button>
    </section>

    <SettingAvatarEdit image={new File([], '')} />
</section>;
}