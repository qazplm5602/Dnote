import AvatarEditor from 'react-avatar-editor';
import style from './avatarEdit.module.scss';
import Button, { SpinnerButton } from '../../Recycle/Button';

import zoomIco from '../../../assets/icons/zoom.svg';
import crawlIco from '../../../assets/icons/crawl.svg';
import { useState } from 'react';

type Props = {
    image: File
}
export default function SettingAvatarEdit({ image }: Props) {
    return <section className={style.main}>
        <Dialog image={image} />
    </section>
}

function Dialog({ image }: Props) {
    const [ scale, setScale ] = useState(100);
    
    const onScaleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        setScale(Number(e.target.value));
    }

    return <div className={style.box}>
        <h1>아바타 편집</h1>

        <AvatarEditor
            image={"https://domi.kr/img/logo.png"}
            className={style.view}
            width={200}
            height={200}
            borderRadius={99}
            border={5}
            scale={scale / 100}
        />

        <section className={style.zoom}>
            <img src={crawlIco} />
            <input type="range" min={50} max={150} value={scale} onChange={onScaleChange} />
            <img src={zoomIco} />
        </section>

        <section className={style.interaction}>
            <SpinnerButton loading={true}>저장</SpinnerButton>
            <Button className={[style.close]}>닫기</Button>
        </section>
    </div>
}