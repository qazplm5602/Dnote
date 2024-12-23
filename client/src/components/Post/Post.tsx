import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

import IconText from '../Recycle/IconText';
import style from './post.module.css';

import NameTag from '../NameTag/NameTag';
import TimeTake from '../TimeTake/TimeTake';
import Button, { IconButton } from '../Recycle/Button';

import eyeSvg from '../../assets/icons/eyes.svg';
import shareSvg from '../../assets/icons/share.svg';
import Footer from '../Footer/Footer';
import PostBoxRow from '../PostBox/PostBoxRow';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import LoadBox from '../Recycle/LoadBox';
import { UserDTO } from '../LoginState/LoginState';
import request from '../Utils/request';
import { dateFormatNumber, numberToKorean } from '../Utils/misc';

import errorSvg from '../../assets/icons/error.svg';
import { AxiosError } from 'axios';
import PostLikeButton from './LikeButton';
import PostChatMain from './Chat/ChatMain';

export interface BasePostDTO {
    title: string,
    tags: string[],
    thumbnail: string,
    content: string,
    created: string
}

export interface PostDTO extends BasePostDTO {
    id: number,
    owner: UserDTO,
    view: number,
    read: number
}

export interface PostIdDTO {
    id: number,
    owner: number
}

export default function Post() {
    const { id, user } = useParams();
    const [ error, setError ] = useState(false);
    const onError = () => setError(true);

    useEffect(() => {
        setError(false);
    }, [id, user]);

    return <>
        {!error ? <main className={`screen_container ${style.main}`}>
            <Content onError={onError} />
            <PopularList />
        </main> : <ErrorPage />}
        
        <Footer />
    </>;
}

function Content({ onError }: { onError: () => void }) {
    const [ post, setPost ] = useState<PostDTO | null>(null);
    const { id, user } = useParams();

    const onPostLoad = async function(process: { alive: boolean }) {
        const result = await request<PostDTO>(`post/info/${user}/${id}`).catch(e => e as AxiosError);
        if (!process.alive) return; // state 가 확실하지 않음 ㅅㄱ

        if (result instanceof AxiosError) {
            if (result.status !== 404) return; // 이거 말고는 대응 할게 없음
            onError();
            return;
        }
        
        setPost(result.data);
    }

    useEffect(() => {
        const process = { alive: true };

        onPostLoad(process);

        return () => {
            process.alive = false;
        }
    }, [ id, user ]);

    if (post === null) {
        return <LoadingContent />;
    }

    return <article className={style.content}>
        <h2 className={style.title}>{post.title}</h2>
        <Tags tags={post.tags} />
        <Detail user={post.owner} time={post.created} read={post.read} view={post.view} />
        
        <ViewerContainer content={post.content} />

        <Interactions title={post.title} />
        <PostChatMain />
    </article>;
}

function LoadingContent() {
    return <article className={`${style.content} ${style.loading}`}>
        <LoadBox className={style.title} />
        <section className={style.tags}>
            <LoadBox className={style.tag} delay={100} />
            <LoadBox className={style.tag} delay={200} />
            <LoadBox className={style.tag} delay={300} />
        </section>
        
        <section className={style.detail}>
            <div className={style.left}>
                <LoadBox className={style.user} delay={400} />
                <LoadBox className={style.sub} delay={500} />
            </div>

            <LoadBox className={style.view} delay={600} />
        </section>
        
        <section className={style.content}></section>
    </article>;
}

function Tags({ tags }: { tags: string[] }) {
    return <section className={style.tags}>
        {tags.map(v => <div>#{v}</div>)}
    </section>;
}

function Detail({ user, time, read, view }: { user: UserDTO, time: string, read: number, view: number }) {
    return <section className={style.detail}>
        <div className={style.left}>
            <NameTag user={user} />
            <p>
                <div className={style.date}>{dateFormatNumber(new Date(time))}</div>
                <div className={style.line}></div>
                <TimeTake time={read} />
            </p>
        </div>

        <IconText className={style.view} icon={eyeSvg} text={`${numberToKorean(view)}명`} />
    </section>;
}

function ViewerContainer({ content }: { content: string }) {
    const viewRef = useRef<Viewer>(null);
    useEffect(() => {
        const instance = viewRef.current?.getInstance();
        instance.setMarkdown(content);
    }, [content]);

    return <Viewer
        ref={viewRef}
        initialValue={["![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)", "", "# Awesome Editor!", "", "It has been _released as opensource in 2018_ and has ~~continually~~ evolved to **receive 10k GitHub ⭐️ Stars**.", "", "## Create Instance", "", "You can create an instance with the following code and use `getHtml()` and `getMarkdown()` of the [Editor](https://github.com/nhn/tui.editor).", "", "```js", "const editor = new Editor(options);", "```", "", "> See the table below for default options", "> > More API information can be found in the document", "", "| name | type | description |", "| --- | --- | --- |", "| el | `HTMLElement` | container element |", "", "## Features", "", "* CommonMark + GFM Specifications", "   * Live Preview", "   * Scroll Sync", "   * Auto Indent", "   * Syntax Highlight", "        1. Markdown", "        2. Preview", "", "## Support Wrappers", "", "> * Wrappers", ">    1. [x] React", ">    2. [x] Vue", ">    3. [ ] Ember"].join("\n")}
    />;
}

function Interactions({ title }: { title: string }) {
    const { id, user } = useParams();
    
    const shareClick = function() {
        navigator.share({
            url: location.href,
            title: `Dnote - ${title}`
        });
    }
    
    // 말이 됨???
    if (user === undefined || id === undefined) return;

    return <section className={style.interaction}>
        <PostLikeButton userId={user} postId={id} />
        <IconButton className={[style.share]} icon={shareSvg} onClick={shareClick} />
    </section>;
}

function PopularList() {
    return <article className={style.popular}>
        <h2>인기있는 콘텐츠</h2>

        <PostBoxRow className={style.item} />
        <PostBoxRow className={style.item} />
        <PostBoxRow className={style.item} />
        <PostBoxRow className={style.item} />
    </article>;
}

function ErrorPage() {
    return <main className={`screen_container ${style.main} ${style.error}`}>
        <img src={errorSvg} className={style.icon} />
        
        <h2>게시물을 찾을 수 없습니다.</h2>
        <div className={style.sub}>삭제된 게시물이거나 잘못된 URL일 수 있습니다.</div>
        
        <Link to='/' className={style.goBack}>
            <Button>홈으로</Button>
        </Link>
    </main>;
}