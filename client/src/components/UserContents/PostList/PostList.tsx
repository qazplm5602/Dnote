import style from './postList.module.scss';

import { PostDTO } from "../../Post/Post";
import PostBox from "../../PostBox/PostBox";
import PostBoxPre from "../../PostBox/PostBoxPre";

type Props = {
    data: PostDTO[] | null,
    className?: string,
    showUser?: boolean,
    preAmount?: number
}

export default function PostList({ data, className, showUser = true, preAmount = 16 }: Props) {
    return <section className={`${style.list} ${className || ''}`}>
        { data ? <PostResult data={data} user={showUser} /> : <PostPre amount={preAmount} /> }
    </section>;
}

function PostResult({ data, user }: { data: PostDTO[], user: boolean }) {
    return <>
        {data.map(v => <PostBox key={`${v.owner.id}/${v.id}`} className={style.item} post={v} user={user} />)}
    </>;
}

function PostPre({ amount }: { amount: number }) {
    return <>
        {Array.from(Array(amount)).map((_, i) => <PostBoxPre key={i} delay={i * 100} />)}
    </>
}