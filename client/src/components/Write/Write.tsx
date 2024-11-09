import { useEffect, useMemo, useRef, useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import Button, { SpinnerButton } from '../Recycle/Button';
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
import request, { ErrorResponse } from '../Utils/request';
import { AxiosError } from 'axios';
import { useNotify } from '../Notify/NotifyContext';
import { useSearchParams } from 'react-router-dom';
import LoadBox from '../Recycle/LoadBox';
import Spinner from '../Recycle/Spinner';

type tempStatus = {
    id: string,
    load: boolean,
    data: tempDTO | null
}

type loadData = {
    save: boolean,
    post: boolean
}

interface tempDTO {
    title: string,
    tags: string[],
    thumbnail: string,
    content: string,
    created: string
}

export default function Write() {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const tempId = useMemo(() => searchParams.get("temp"), [ searchParams ]);
    // const [ tempStatus, setTempStatus ] = useState<tempStatus>({ id: '', load: false });
    const tempStatusRef = useRef<tempStatus>({ id: '', load: false, data: null });
    const [ tempData, setTempData ] = useState<tempDTO | null>(null);

    const [title, setTitle] = useState<string>("");
    const notify = useNotify();
    const [showTemp, setShowTemp] = useState(false);
    const [loader, setLoader] = useState<loadData>({ post: false, save: false });

    const tagRef = useRef<string[]>([]);
    const editorRef = useRef<Editor>(null);

    const onPost = async function() {
        if (editorRef.current === null) return;
        
        const editor = editorRef.current?.getInstance();

        if (title.length === 0) {
            notify('Error', "제목을 입력해야 합니다.", 5000);
            return;
        }

        setLoader(prev => ({ ...prev, post: true }));
        
        const form = {
            title,
            tags: tagRef.current,
            content: editor.getHTML()
        }
        const response = await request("post/upload", { method: "POST", data: form }).catch(e => e as AxiosError);

        setLoader(prev => ({ ...prev, post: false }));

        if (response instanceof AxiosError) {
            notify('Error', "업로드 실패. 나중에 다시 시도하세요.", 5000);
            return;
        }

        console.log(title, editor.getHTML(), tagRef.current);
    }

    const isSameTags = function(target: string[]) {
        const nowTag = new Set(tagRef.current);
        const targetTag = new Set(target);
        
        let same = true;
        nowTag.forEach(v => {
            if (!targetTag.has(v)) {
                same = false;
                return false;
            }
        });

        if (same)
            targetTag.forEach(v => {
                if (!nowTag.has(v)) {
                    same = false;
                    return false;
                }
            });

        return same;
    }

    const isTempChanged = function(): boolean {
        const editor = editorRef.current?.getInstance();
        if (tempStatusRef.current.data === null || editor === undefined) return false;
        
        const origin = tempStatusRef.current.data;
        console.log(origin.title, title);
        console.log(origin.content, editor.getHTML());
        return (origin.title !== title || origin.content !== editor.getHTML() || !isSameTags(origin.tags));
    }

    const onTempLoad = function() {
        setShowTemp(true);
    }
    const onTempClose = () => setShowTemp(false);
    const onNewPost = function() {
        if (isTempChanged()) {
            const check = confirm("글이 저장되지 않았습니다. 새로 만드시겠습니까?");
            if (!check) return;
        }

        // 그냥 temp id 빼버림
        searchParams.delete("temp");
        setSearchParams(searchParams);
    }
    const onTempSave = async function() {
        if (editorRef.current === null) return;
        
        const editor = editorRef.current?.getInstance();

        if (title.length === 0) {
            notify('Error', "제목을 입력해야 합니다.", 5000);
            return;
        }

        // 로딩!!!
        setLoader({ ...loader, save: true });

        const content = editor.getHTML();
        const form = {
            title,
            tags: tagRef.current,
            content
        };

        const isEdit = tempId !== null;
        const result = await request(`post/temp/${isEdit ? `edit?id=${tempId}` : 'upload'}`, { method: "POST", data: form }).catch(e => e as AxiosError);
        
        setLoader(prev => ({ ...prev, save: false }));
        
        if (result instanceof AxiosError) {
            notify('Error', "오류가 발생하였습니다.", 5000);
            return;
        }


        if (isEdit) {
            // 기존꺼 변경
            if (tempStatusRef.current.data !== null) {
                const data = tempStatusRef.current.data;
                data.title = title;
                data.tags = [...tagRef.current];
                data.content = content;
            }
        } else { // tempId 변경
            const temp = result.data as string;
            setSearchParams({ temp });
        }
    }

    const tempLoadData = async function() {
        if (tempId === null) return;
        tempStatusRef.current.id = tempId; // 바꿩

        const result = await request<tempDTO>(`post/temp/${tempId}`);
        setTempData(result.data);
        setTitle(result.data.title);

        tempStatusRef.current.data = result.data;
    }

    // tempid 변경 감지
    useEffect(() => {
        if (tempStatusRef.current.id === tempId) return; // 불러올 필요가 없음
        if (tempId === null) {
            tempStatusRef.current.id = "";
            setTitle("");
            setTempData(null);
        }

        setTempData(null);
        tempLoadData();
    }, [tempId]);

    if ((tempId !== null && tempData === null) || (tempId === null && tempData !== null)) {
        return <LoadingScreen />;
    }

    return <main className="screen_container">
        <TitleInput value={title} setValue={setTitle} />
        <TagBox tagRef={tagRef} />
        {(tempId === null || tempData !== null) && <EditorSection editorRef={editorRef} initValue={tempId === null ? "Hello Domi!" : tempData?.content || ""} />}
        <Interactions onPost={onPost} onTempLoad={onTempLoad} onNewPost={onNewPost} onTempSave={onTempSave} temp={tempId !== null} loading={loader} />

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

function Interactions({ onPost, onTempLoad, onTempSave, onNewPost, temp, loading }: { onPost: () => void, onTempLoad: () => void, onNewPost: () => void, onTempSave: () => void, temp: boolean, loading: loadData }) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const onDebug = function() {
        const tempId = searchParams.get("temp");
        
        if (tempId === null) {
            setSearchParams({ temp: "asdf" });
        } else {
            searchParams.delete("temp");
            setSearchParams(searchParams);
        }
    }
    
    return <article className={style.interaction_main}>
        {!temp && <Button className={[style.gray]} onClick={onTempLoad}>불러오기</Button>}
        {temp && <Button className={[style.gray]} onClick={onNewPost}>새로 만들기</Button>}
        <SpinnerButton className={[style.gray]} onClick={onTempSave} loading={loading.save}>{temp ? '' : '임시'}저장</SpinnerButton>
        
        {/* 디버그 버튼 */}
        {/* <Button onClick={onDebug}>디버긍</Button> */}

        <div className={style.line}></div>

        <SpinnerButton className={[style.send_btn]} onClick={onPost} loading={loading.post}><IconText icon={sendSvg} text='게시하기' /></SpinnerButton>
    </article>;
}

function EditorSection({ editorRef, initValue }: { editorRef?: React.RefObject<Editor>, initValue: string }) {
    const notify = useNotify();

    const addImageBlobHook = async function(blob: File, cb: (url: string, type: string) => void) {
        const form = new FormData();
        form.append("domi", blob);

        const response = await request<string>("post/attachment/upload", { method: "POST", data: form }).catch(e => e as AxiosError<ErrorResponse>);
        // 나중에 오류 처리...
        if (response instanceof AxiosError) {
            notify('Error', `이미지 업로드 실패 (${response.response?.data.message})`, 5000);
            return;
        }

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
            initialValue={initValue}
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

function LoadingScreen() {
    return <main className={`screen_container ${style.load}`}>
        <LoadBox className={style.title_input} />

        <section className={style.tags}>
            <LoadBox className={style.tag} delay={100} />
            <LoadBox className={style.tag} delay={200} />
            <LoadBox className={style.tag} delay={300} />
            <LoadBox className={style.tag} delay={400} />
            <LoadBox className={style.tag} delay={500} />
            <LoadBox className={style.tag} delay={600} />
        </section>

        <section className={style.editor_container}>
            <LoadBox className={style.editor} delay={700} />
        </section>

        <section className={style.interaction_main}>
            <LoadBox className={style.btn} delay={800} />
            <LoadBox className={style.btn} delay={900} />

            <div className={style.line}></div>

            <LoadBox className={style.btn} delay={1000} />
        </section>
    </main>
}