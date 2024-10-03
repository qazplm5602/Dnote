import { useEffect, useRef, useState } from 'react';
import style from './write.module.css';
import ReactTextareaAutosize from 'react-textarea-autosize';

import closeSvg from '../../assets/icons/ic-close-solid.svg';

export default function Write() {
    const [title, setTitle] = useState<string>("");

    return <main className="screen_container">
        <TitleInput value={title} setValue={setTitle} />
        <TagBox />
    </main>;
}

function TagBox() {
    return <article className={style.tag_main}>
        <div className={style.title}>태그</div>

        <section className={style.tags}>
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <Tag />
            <input type="text" className={style.input} />
        </section>
    </article>;
}

function Tag() {
    return <div className={style.tag}>
        <span>react</span>
        <button><img src={closeSvg} /></button>
    </div>;
}

function TitleInput({ value, setValue }: { value: string, setValue: React.Dispatch<React.SetStateAction<string>> }) {
    const onValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

    return <ReactTextareaAutosize className={style.title_input} value={value} onChange={onValueChange} placeholder="제목을 입력하세요." />
}