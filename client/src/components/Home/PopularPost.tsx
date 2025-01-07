import style from './home.module.css';

import PostBox from "../PostBox/PostBox";
import HeadMenuList from "../Recycle/HeadMenuList/HeadMenuList";
import PostBoxPre from '../PostBox/PostBoxPre';
import { PostDTO } from '../Post/Post';
import { useEffect, useState } from 'react';
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';

const ITEM_SIZE = 4;

export default function HomePopularPost() {
    const [ list, setList ] = useState<PostDTO[] | null>(null);

    const loadData = async function(aliveRef: aliveType) {
        const result = await request<PostDTO[]>("post/popular", { params: { size: ITEM_SIZE } });
        if (!aliveRef.alive) return;

        setList(result.data);
    }

    useEffect(() => {
        const aliveRef = { alive: true };

        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, []);

    return <HeadMenuList title='최근 트렌드' menu='더보기' to='/post/popular' className={`screen_container ${style.popular_list}`}>
        {list ? <PostBoxList list={list} /> : <PreBoxs />}
    </HeadMenuList>;
}

function PreBoxs() {
    return <>
        {Array.from(Array(ITEM_SIZE)).map((_, i) => <PostBoxPre key={i} delay={100 * i} />)}
    </>;
}

function PostBoxList({ list }: { list: PostDTO[] }) {
    return <>
        {list.map(v => <PostBox key={v.id} post={v} />)}
    </>
}