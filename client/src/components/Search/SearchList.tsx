import style from './search.module.css';
import PostBoxPre from "../PostBox/PostBoxPre";
import PostBox from '../PostBox/PostBox';
import { PostDTO } from '../Post/Post';

export default function SearchList({ data }: { data: PostDTO[] }) {
    console.log(data);
    return <section className={style.list}>
        {data.map(v => <PostBox key={v.id} className={style.item} />)}
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
    </section>;
}