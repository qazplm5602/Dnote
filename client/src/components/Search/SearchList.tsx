import style from './search.module.css';
import PostBoxPre from "../PostBox/PostBoxPre";
import PostBox from '../PostBox/PostBox';
import { PostDTO } from '../Post/Post';

export default function SearchList({ data }: { data: PostDTO[] }) {
    return <section className={style.list}>
        {data.map(v => <PostBox key={v.id} className={style.item} post={v} />)}
    </section>;
}

export function SearchListPre() {
    return <section className={style.list}>
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
    </section>;
}