import { useEffect, useMemo, useRef, useState } from 'react';
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
    const [tagSet, setTagSet] = useState<Set<string>>(new Set());
    const tags = useMemo(() => Array.from(tagSet), [tagSet]);
 
    const [tagValue, setTagValue] = useState("");

    const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => setTagValue(e.target.value);
    const onInputBlur = function() {
        if (tagValue.length === 0) return;

        setTagSet(new Set([ ...tags, tagValue]));
        setTagValue("");
    }
    const onInputKeyUp = function(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.code === "Enter")
            onInputBlur();
    }
    const removeTag = function(value: string) {
        if (tagSet.delete(value))
            setTagSet(new Set([...Array.from(tagSet)]));
    }

    useEffect(() => {
        // 공백 확인
        if (!tagValue.includes(' ')) return;

        const list = tagValue.split(' ');
        if (list.length < 2) return; // 너무 적다

        setTagSet(new Set([ ...tagSet, ...list.slice(0, list.length - 1).filter(v => v.length > 0) ]));
        setTagValue(list[list.length - 1]);
    }, [tagValue]);

    return <article className={style.tag_main}>
        <div className={style.title}>태그</div>

        <section className={style.tags}>
            {tags.map(v => <Tag key={v} text={v} onDelete={() => removeTag(v)} />)}
            <input type="text" className={style.input} value={tagValue} onChange={onValueChange} onKeyDown={onInputKeyUp} onBlur={onInputBlur} />
        </section>
    </article>;
}

function Tag({ text, onDelete }: { text: string, onDelete: () => void }) {
    return <div className={style.tag}>
        <span>{text}</span>
        <button onClick={onDelete}><img src={closeSvg} /></button>
    </div>;
}

function TitleInput({ value, setValue }: { value: string, setValue: React.Dispatch<React.SetStateAction<string>> }) {
    const onValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

    return <ReactTextareaAutosize className={style.title_input} value={value} onChange={onValueChange} placeholder="제목을 입력하세요." />
}