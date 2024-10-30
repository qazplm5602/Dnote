import { useEffect, useMemo, useRef, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import Button from '../Recycle/Button';
import IconText from '../Recycle/IconText';

// 에디터
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';

// 에디터 플러그인
import EditorColor from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import style from './write.module.css';

import closeSvg from '../../assets/icons/ic-close-solid.svg';
import sendSvg from '../../assets/icons/ic-round-send.svg';
import WriteTemp from './WriteTemp';
import request from '../Utils/request';
import { AxiosError } from 'axios';

export default function Write() {
    const [title, setTitle] = useState<string>("");
    const [showTemp, setShowTemp] = useState(false);

    const tagRef = useRef<string[]>([]);
    const editorRef = useRef<Editor>(null);

    const onPost = async function() {
        if (editorRef.current === null) return;
        
        const editor = editorRef.current?.getInstance();

        if (title.length === 0) {
            // 나중에 안되는 표시 함
            return;
        }
        
        const form = {
            title,
            tags: tagRef.current,
            content: editor.getHTML()
        }
        const response = await request("post/upload", { method: "POST", data: form }).catch(e => e as AxiosError);
        if (response instanceof AxiosError) {
            // 오류 처리
            return;
        }

        console.log(title, editor.getHTML(), tagRef.current);
    }

    const onTempLoad = function() {
        setShowTemp(true);
    }
    const onTempClose = () => setShowTemp(false);

    return <main className="screen_container">
        <TitleInput value={title} setValue={setTitle} />
        <TagBox tagRef={tagRef} />
        <EditorSection editorRef={editorRef} />
        <Interactions onPost={onPost} onTempLoad={onTempLoad} />

        <WriteTemp show={showTemp} onClose={onTempClose} />
    </main>;
}

function TagBox({ tagRef }: { tagRef: React.MutableRefObject<string[]> }) {
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

    // 부모한테 알려줘야징
    useEffect(() => {
            tagRef.current = tags;
    }, [tagSet]);

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

function Interactions({ onPost, onTempLoad }: { onPost: () => void, onTempLoad: () => void }) {
    return <article className={style.interaction_main}>
        <Button className={[style.gray]} onClick={onTempLoad}>불러오기</Button>
        <Button className={[style.gray]}>임시저장</Button>

        <div className={style.line}></div>

        <Button className={[style.send_btn]} onClick={onPost}><IconText icon={sendSvg} text='게시하기' /></Button>
    </article>;
}

function EditorSection({ editorRef }: { editorRef?: React.RefObject<Editor> }) {
    const addImageBlobHook = async function(blob: File, cb: (url: string, type: string) => void) {
        const form = new FormData();
        form.append("domi", blob);

        const response = await request<string>("post/attachment/upload", { method: "POST", data: form });
        // 나중에 오류 처리...

        cb(`/file/attachment/${response.data}`, 'image');
    }

    useEffect(() => {
        if (!editorRef?.current) return;

        const editor = editorRef.current.getInstance();
        editor.removeHook('addImageBlobHook');
        editor.addHook('addImageBlobHook', (blob: File, cb: (url: string, type: string) => void) => {
            addImageBlobHook(blob, cb);
        });
    }, [ editorRef ]);

    return <article className={style.editor_container}>
        <Editor
            initialValue="hello react editor world!"
            previewStyle="vertical"
            height="100%"
            initialEditType="markdown"
            useCommandShortcut={true}
            language="ko-KR"
            plugins={[ EditorColor ]}
            ref={editorRef}
        />
    </article>;
}