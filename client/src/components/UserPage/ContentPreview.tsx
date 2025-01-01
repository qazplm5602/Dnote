import { useEffect, useState } from 'react';
import PostBox from '../PostBox/PostBox';
import PostBoxPre from '../PostBox/PostBoxPre';
import HeadMenuList from '../Recycle/HeadMenuList/HeadMenuList';
import style from './userpage.module.css';
import { PostDTO } from '../Post/Post';
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';
import { PostPageResultDTO } from '../Search/Search';

type Props = {
    user: string,
    title: string,
    sort: number,
    size: number
}

export default function UserPageContentPreview({ title, user, sort, size }: Props) {
    const [ list, setList ] = useState<PostDTO[] | null>(null);

    const loadData = async function(aliveRef: aliveType) {
        setList(null);
        
        const result = await request<PostPageResultDTO>(`post/user/${user}`, { params: { sort, size } });
        if (!aliveRef.alive) return;

        setList(result.data.posts);
    }

    useEffect(() => {
        const aliveRef = { alive: true };
        
        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [ user, sort ]);

    if (list?.length === 0) return; // 걍 없음

    return <HeadMenuList title={title} menu='모두 보기' to={`/user/${user}/content?sort=${sort}`} className={`${style.list} screen_container`}>
        {list && list.map(v => <PostBox key={v.id} post={v} user={false} />)}
        {list === null && <PreBoxs size={size} />}
    </HeadMenuList>
}

function PreBoxs({ size }: { size: number }) {
    return <>
        {Array.from(Array(size), (_, i) => <PostBoxPre key={i} delay={300 * i} />)}
    </>;
}