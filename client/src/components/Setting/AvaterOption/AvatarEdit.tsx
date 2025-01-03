import AvatarEditor from 'react-avatar-editor';
import style from './avatarEdit.module.scss';
import Button, { SpinnerButton } from '../../Recycle/Button';

import zoomIco from '../../../assets/icons/zoom.svg';
import crawlIco from '../../../assets/icons/crawl.svg';
import { useRef, useState } from 'react';
import { useNotify } from '../../Notify/NotifyContext';

type Props = {
    image: File,
    onClose?: () => void
}
export default function SettingAvatarEdit(props: Props) {
    return <section className={style.main}>
        <Dialog {...props} />
    </section>
}

function Dialog({ image, onClose }: Props) {
    const [ scale, setScale ] = useState(100);
    const [ loading, setLoading ] = useState(false);
    const editor = useRef<AvatarEditor>(null);
        const notify = useNotify();
    
    const onScaleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setScale(Number(e.target.value));
    }
    const imageUploadToServer = function(blob: Blob | null) {
        if (blob === null) {
            setLoading(false);
            notify('Error', "이미지 변환 중 오류가 발생하였습니다.", 5000);
            return;
        }

        // ... 백엔드 구현 뒤
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