import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

// 코드 하이라이트 플러그인
import Prism from 'prismjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import IconText from '../Recycle/IconText';
import style from './post.module.css';

import NameTag from '../NameTag/NameTag';
import TimeTake from '../TimeTake/TimeTake';
import { IconButton } from '../Recycle/Button';

import eyeSvg from '../../assets/icons/eyes.svg';
import shareSvg from '../../assets/icons/share.svg';
import Footer from '../Footer/Footer';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import LoadBox from '../Recycle/LoadBox';
import { UserDTO } from '../LoginState/LoginState';
import request, { ErrorResponse } from '../Utils/request';
import { dateFormatNumber, numberToKorean } from '../Utils/misc';

import { AxiosError } from 'axios';
import PostLikeButton from './LikeButton';
import PostChatMain from './Chat/ChatMain';
import PostViewCounter from './ViewSys/ViewCounter';
import PostPopularList from './PopularList/PopularList';
import PostOtherMenu from './OtherMenu/OtherMenu';
import MetaTag from '../MetaTag/MetaTag';
import ErrorPage from '../ErrorPage/ErrorPage';
import { getThumbnailUrl } from '../PostBox/PostBox';
import PostIndexSection, { IndexInitEvent } from './IndexSection/IndexSection';

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
    read: number,
    previewContent: string
}

export interface PostIdDTO {
    id: number,
    owner: number
}

type IndexInitRefType = React.MutableRefObject<IndexInitEvent | undefined>;

export default function Post() {
    const { id, user } = useParams();
    const [ error, setError ] = useState(false);
    const onError = () => setError(true);
    const indexInitRef = useRef<IndexInitEvent>();

    useEffect(() => {
        setError(false);
    }, [id, user]);

    // return <>
    //     {!error ? <main className={`screen_container ${style.main}`}>
    //         <Content onError={onError} />
    //         <PopularList />
    //     </main> : <ErrorPage />}
        
    //     <Footer />
    // </>;

    return !error ? <main>
        <section className={`screen_container ${style.main}`}>
            <Content onError={onError} indexInitRef={indexInitRef} />

            <aside className={style.side}>
                <PostIndexSection initRef={indexInitRef} />
                <PostPopularList />
            </aside>
        </section>
        <Footer />
    </main> : <ErrorPage title='게시물을 찾을 수 없습니다.' desc='삭제된 게시물이거나 잘못된 URL일 수 있습니다.' />;
}

function Content({ onError, indexInitRef }: { onError: () => void, indexInitRef?: IndexInitRefType }) {
    const [ post, setPost ] = useState<PostDTO | null>(null);
    const { id, user } = useParams();

    const onPostLoad = async function(process: { alive: boolean }) {
        const result = await request<PostDTO>(`post/info/${user}/${id}`).catch(e => e as AxiosError<ErrorResponse>);
        if (!process.alive) return; // state 가 확실하지 않음 ㅅㄱ

        if (result instanceof AxiosError) {
            const code = result.response?.data?.code;
            if (code === "POST0" || code === "USER2")
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
        <MetaTag
            title={post.title}
            description={post.previewContent}
            keywords={post.tags.join(", ")}
            image={post.thumbnail ? getThumbnailUrl(post.thumbnail) : undefined}
            date={new Date(post.created)}
            owner={post.owner.name}
        />

        <h2 className={style.title}>{post.title}</h2>
        <Tags tags={post.tags} />
        <Detail user={post.owner} time={post.created} read={post.read} view={post.view} />
        
        <ViewerContainer content={post.content} indexInitRef={indexInitRef} />
        <PostViewCounter />

        <Interactions title={post.title} />
        <PostChatMain />
    </article>;
}

function LoadingContent() {
    return <article className={`${style.content} ${style.loading}`}>
        <MetaTag title='Loading' />

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

function ViewerContainer({ content, indexInitRef }: { content: string, indexInitRef?: IndexInitRefType }) {
    const viewRef = useRef<Viewer>(null);
    useEffect(() => {
        const instance = viewRef.current?.getInstance();
        instance.setMarkdown(content);
        
        const rootEl = viewRef.current?.getRootElement();
        if (indexInitRef?.current && rootEl)
            indexInitRef.current(rootEl);
    }, [content]);

    return <Viewer
        ref={viewRef}
        plugins={[
            [codeSyntaxHighlight, { highlighter: Prism }]
        ]}
        initialValue={" "}
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
        <PostOtherMenu />
    </section>;
}