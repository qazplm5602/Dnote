import style from '../post.module.css';
import PostBoxRow from "../../PostBox/PostBoxRow";
import PostBoxRowPre from '../../PostBox/PostBoxRowPre';
import { useEffect, useState } from 'react';
import { PostDTO } from '../Post';
import { aliveType } from '../../Utils/misc';
import request from '../../Utils/request';

export default function PostPopularList() {
    const [ list, setList ] = useState<PostDTO[] | null>(null);
    
    const loadData = async function(aliveRef: aliveType) {
        const result = await request<PostDTO[]>("post/popular?size=5&random=1");
        if (!aliveRef.alive) return;

        setList(result.data);
    }

    useEffect(() => {
        const aliveRef = { alive: true };
        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, []); // 이건 페이지가 바뀌어도 새로고침 안하도록 함 (최적화 ㅅㄱ)

    return <article className={style.popular}>
        <h2>인기있는 콘텐츠</h2>

        {list ? <PostBoxList list={list} /> : <LoadingBox />}
    </article>;
}

function PostBoxList({ list }: { list: PostDTO[] }) {
    return <>
        {list.map(v => <PostBoxRow key={v.id} post={v} />)}
    </>
}

function LoadingBox() {
    return <>
        {Array.from(Array(5)).map((_, i) => <PostBoxRowPre key={i} delay={100 * i} className={style.item} />)}
    </>
}