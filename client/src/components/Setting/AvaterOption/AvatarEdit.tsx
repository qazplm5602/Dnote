import AvatarEditor from 'react-avatar-editor';
import style from './avatarEdit.module.scss';
import Button, { SpinnerButton } from '../../Recycle/Button';

import zoomIco from '../../../assets/icons/zoom.svg';
import crawlIco from '../../../assets/icons/crawl.svg';
import { useRef, useState } from 'react';
import { useNotify } from '../../Notify/NotifyContext';
import request, { ErrorResponse } from '../../Utils/request';
import { AxiosError } from 'axios';

type Props = {
    image: File,
    onClose?: () => void,
    onChangeAvatar?: (url: string) => void
}
export default function SettingAvatarEdit(props: Props) {
    return <section className={style.main}>
        <Dialog {...props} />
    </section>
}

function Dialog({ image, onClose, onChangeAvatar }: Props) {
    const [ scale, setScale ] = useState(100);
    const [ loading, setLoading ] = useState(false);
    const editor = useRef<AvatarEditor>(null);
        const notify = useNotify();
    
    const onScaleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setScale(Number(e.target.value));
    }
    const imageUploadToServer = async function(blob: Blob | null) {
        if (blob === null) {
            setLoading(false);
            notify('Error', "이미지 변환 중 오류가 발생하였습니다.", 5000);
            return;
        }

        const form = new FormData();
        form.append("file", blob);

        const result = await request<string>("profile/avatar", { method: "POST", data: form }).catch(e => e as AxiosError<ErrorResponse>);
        if (result instanceof AxiosError) {
            const data = result.response?.data;
            if (data?.code === "PROFILE1") {
                notify('Error', data.message, 5000);
            } else {
                notify('Error', "아바타를 업로드 할 수 없습니다. 나중에 다시 시도하세요.", 5000);
            }
            return;
        }

        if (onChangeAvatar)
            onChangeAvatar(result.data);
    }
    const onSave = function() {
        const canvas = editor.current?.getImageScaledToCanvas();
        if (!canvas) return;

        setLoading(true);
        canvas.toBlob(blob => imageUploadToServer(blob));
    }

    return <div className={style.box}>
        <h1>아바타 편집</h1>

        <AvatarEditor
            image={image}
            className={style.view}
            width={200}
            height={200}
            borderRadius={99}
            border={5}
            scale={scale / 100}
            ref={editor}
        />

        <section className={style.zoom}>
            <img src={crawlIco} />
            <input type="range" min={50} max={150} value={scale} onChange={onScaleChange} />
            <img src={zoomIco} />
        </section>

        <section className={style.interaction}>
            <SpinnerButton loading={loading} onClick={onSave}>저장</SpinnerButton>
            <Button className={[style.close]} onClick={onClose} disabled={loading}>닫기</Button>
        </section>
    </div>
}