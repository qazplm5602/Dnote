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
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadBox from '../Recycle/LoadBox';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { LoginState } from '../Redux/LoginStateSlice';
import WriteThumbnailBox from './ThumbnailBox';
import { PostDTO } from '../Post/Post';
import MetaTag from '../MetaTag/MetaTag';

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
    const postId = useMemo(() => searchParams.get("post"), [ searchParams ]);
    
    const [ postData, setPostData ] = useState<PostDTO | null>(null);
    const currentPostId = useRef<string>("");

    // const [ tempStatus, setTempStatus ] = useState<tempStatus>({ id: '', load: false });
    const tempStatusRef = useRef<tempStatus>({ id: '', load: false, data: null });
    const [ tempData, setTempData ] = useState<tempDTO | null>(null);

    const [ tags, setTags ] = useState<Set<string>>(new Set());
    const [title, setTitle] = useState<string>("");
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const notify = useNotify();
    const [showTemp, setShowTemp] = useState(false);
    const [loader, setLoader] = useState<loadData>({ post: false, save: false });

    const user = useSelector<RootState, LoginState>(v => v.user);
    const navigate = useNavigate();

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
            tags: Array.from(tags),
            content: editor.getMarkdown(),
            thumbnail
        }
        const response = await request<number>(`post/${postId !== null ? `edit/${postId}` : 'upload'}`, { method: "POST", data: form }).catch(e => e as AxiosError);

        setLoader(prev => ({ ...prev, post: false }));

        if (response instanceof AxiosError) {
            notify('Error', "업로드 실패. 나중에 다시 시도하세요.", 5000);
            return;
        }

        // console.log(title, editor.getMarkdown(), Array.from(tags));

        // 업로드 되면 temp가 있다면 삭제 해야함
        if (tempId !== null) {
            const result = await request<void>(`post/temp/remove?id=${tempId}&origin=${response.data}`, { method: "DELETE" }).catch(e => e as AxiosError);
            if (result instanceof AxiosError) {
                notify('Error', "임시글을 삭제할 수 없습니다.", 5000);
                return;
            }
        }

        // 게시물로 이동
        navigate(`/post/${user.id}/${postId !== null ? postId : response.data}`);
    }

    const isSameTags = function(target: string[]) {
        const targetTag = new Set(target);
        
        let same = true;
        tags.forEach(v => {
            if (!targetTag.has(v)) {
                same = false;
                return false;
            }
        });

        if (same)
            targetTag.forEach(v => {
                if (!tags.has(v)) {
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
        console.log(origin.content, editor.getMarkdown());
        return (origin.title !== title || origin.content !== editor.getMarkdown() || !isSameTags(origin.tags) || origin.thumbnail !== thumbnail);
    }

    const isPostChanged = function() {
        const editor = editorRef.current?.getInstance();
        if (postData === null || editor === undefined) return false;

        return postData.title !== title || postData.thumbnail !== thumbnail || postData.content !== editor.getMarkdown() || !isSameTags(postData.tags);
    }

    const onTempLoad = function() {
        setShowTemp(true);
    }
    const onTempClose = () => setShowTemp(false);
    const onNewPost = function() {
        if (tempId !== null ? isTempChanged() : isPostChanged()) {
            const check = confirm("글이 저장되지 않았습니다. 새로 만드시겠습니까?");
            if (!check) return;
        }

        // 그냥 temp id 빼버림
        searchParams.delete("temp");
        searchParams.delete("post");
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

        const content = editor.getMarkdown();
        const form = {
            title,
            tags: Array.from(tags),
            content,
            thumbnail
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
                data.tags = Array.from(tags);
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
        setTags(new Set(result.data.tags));
        setThumbnail(result.data.thumbnail);

        tempStatusRef.current.data = result.data;
    }

    const postLoadData = async function() {
        if (postId === null) return;
        currentPostId.current = postId;

        const result = await request<PostDTO>(`post/info/${user.id}/${postId}`);
        setPostData(result.data);

        setTitle(result.data.title);
        setTags(new Set(result.data.tags));
        setThumbnail(result.data.thumbnail);
    }

    // tempid 변경 감지
    useEffect(() => {
        if ((tempStatusRef.current.id || null) === tempId && (currentPostId.current === postId)) return; // 불러올 필요가 없음
        if (postId !== null && !user.logined) return; // 로그인 중이 아닐때는 불러올 수 없음음

        if (tempId === null && postId === null) {
            tempStatusRef.current.id = "";
            currentPostId.current = "";

            setTitle("");
            setTags(new Set());
            setThumbnail(null);
        }

        setPostData(null);
        setTempData(null);

        if (tempId !== null)
            tempLoadData();
        else if (postId !== null)
            postLoadData();
    }, [tempId, postId, user]);

    if ((tempId !== null && tempData === null) || (tempId === null && tempData !== null) || (postId === null && postData !== null) || (postId !== null && postData === null)) {
        return <LoadingScreen />;
    }

    let initContent;
    let metaTitle = "글쓰기";
    if (postId !== null) {
        initContent = postData?.content;
        metaTitle = "글 수정하기";
    }
    else if (tempId !== null) {
        initContent = tempData?.content;
        metaTitle = "임시 글 수정하기";
    }
    

    return <main>
        <MetaTag title={metaTitle} />
        <TitleInput value={title} setValue={setTitle} />
        <TagBox tagSet={tags} setTagSet={setTags} />
        <EditorSection editorRef={editorRef} initValue={initContent || 'hello domi!'} />
        <WriteThumbnailBox value={thumbnail} setValue={setThumbnail} />
        <Interactions onPost={onPost} onTempLoad={onTempLoad} onNewPost={onNewPost} onTempSave={onTempSave} temp={tempId !== null} post={postId !== null} loading={loader} />

        <WriteTemp show={showTemp} onClose={onTempClose} />
    </main>;
}

function TagBox({ tagSet, setTagSet }: { tagSet: Set<string>, setTagSet: React.Dispatch<React.SetStateAction<Set<string>>> }) {
    // const [tagSet, setTagSet] = useState<Set<string>>(new Set());
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

    return <article className={`screen_container ${style.tag_main}`}>
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

    return <ReactTextareaAutosize className={`screen_container ${style.title_input}`} value={value} onChange={onValueChange} placeholder="제목을 입력하세요." />
}

function Interactions({ onPost, onTempLoad, onTempSave, onNewPost, temp, post, loading }: { onPost: () => void, onTempLoad: () => void, onNewPost: () => void, onTempSave: () => void, temp: boolean, post: boolean, loading: loadData }) {
    // const [ searchParams, setSearchParams ] = useSearchParams();
    // const onDebug = function() {
    //     const tempId = searchParams.get("temp");
        
    //     if (tempId === null) {
    //         setSearchParams({ temp: "asdf" });
    //     } else {
    //         searchParams.delete("temp");
    //         setSearchParams(searchParams);
    //     }
    // }
    
    return <article className={`screen_container ${style.interaction_main}`}>
        {!temp && !post && <Button className={[style.gray]} onClick={onTempLoad}>불러오기</Button>}
        {(temp || post) && <Button className={[style.gray]} onClick={onNewPost}>새로 만들기</Button>}
        {!post && <SpinnerButton className={[style.gray]} onClick={onTempSave} loading={loading.save}>{temp ? '' : '임시'}저장</SpinnerButton>}
        
        {/* 디버그 버튼 */}
        {/* <Button onClick={onDebug}>디버긍</Button> */}

        <div className={style.line}></div>

        <SpinnerButton className={[style.send_btn]} onClick={onPost} loading={loading.post}><IconText icon={sendSvg} text={`${post ? '수정' : '게시'}하기`} /></SpinnerButton>
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

    return <article className={`screen_container ${style.editor_container}`}>
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