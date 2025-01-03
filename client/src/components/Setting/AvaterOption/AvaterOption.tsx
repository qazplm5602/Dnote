import { getProfileURL } from '../../NameTag/NameTag';
import Button from '../../Recycle/Button';
import style from '../settingGeneric.module.css';
import SettingAvatarEdit from './AvatarEdit';
import { useRef, useState } from 'react';
import { useNotify } from '../../Notify/NotifyContext';
import { useSWRConfig } from 'swr';
import { USER_CACHE_KEY } from '../../LoginState/LoginState';

type Props = {
    avater: string | null,
    setAvatar: React.Dispatch<React.SetStateAction<string | null>>
};
export default function SettingProfileOption({ avater, setAvatar }: Props) {
    const [ uploadImage, setUploadImage ] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const notify = useNotify();
    const { mutate } = useSWRConfig()

    const onUploadClick = function() {
        fileRef.current?.click();
    }
    const onFileChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) return;

        const file = e.target.files[0];
        const isImage = file.type.startsWith("image/");
        
        if (!isImage) {
            notify('Error', "이미지만 가능합니다.", 5000);
            return;
        }

        setUploadImage(file);
    }
    const onAvatarEditClose = function() {
        setUploadImage(null);
    }
    const onChangeAvatar = function(image: string) {
        onAvatarEditClose();
        setAvatar(image);
        mutate(USER_CACHE_KEY);
    }

    return <section className={style.profile}>
    <h3>프로필 이미지</h3>

    <section className={style.group}>
        <img className={style.avater} src={getProfileURL(avater)} />
        <input type="file" ref={fileRef} onChange={onFileChange} className={style.file} />
        <Button className={[style.upload_btn]} onClick={onUploadClick}>업로드<span>권장 사이즈 512x512</span></Button>
    </section>

    {uploadImage && <SettingAvatarEdit image={uploadImage} onClose={onAvatarEditClose} onChangeAvatar={onChangeAvatar} />}
</section>;
}