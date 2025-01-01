import style from './postList.module.scss';

import { PostDTO } from "../../Post/Post";
import PostBox from "../../PostBox/PostBox";
import PostBoxPre from "../../PostBox/PostBoxPre";

type Props = {
    data: PostDTO[] | null,
    className?: string
}

export default function PostList({ data, className }: Props) {
    return <section className={`${style.list} ${className || ''}`}>
        { data ? <PostResult data={data} /> : <PostPre /> }
    </section>;
}

function PostResult({ data }: { data: PostDTO[] }) {
    return <>
        {data.map(v => <PostBox key={v.id} className={style.item} post={v} />)}
    </>;
}

function PostPre() {
    return <>
        <PostBoxPre  />
        <PostBoxPre delay={100} />
        <PostBoxPre delay={200} />
        <PostBoxPre delay={300} />
        <PostBoxPre delay={400} />
        <PostBoxPre delay={500} />
        <PostBoxPre delay={600} />
        <PostBoxPre delay={700} />
        <PostBoxPre delay={800} />
        <PostBoxPre delay={900} />
        <PostBoxPre delay={1000} />
        <PostBoxPre delay={1100} />
        <PostBoxPre delay={1200} />
        <PostBoxPre delay={1300} />
        <PostBoxPre delay={1400} />
        <PostBoxPre delay={1500} />
    </>
}