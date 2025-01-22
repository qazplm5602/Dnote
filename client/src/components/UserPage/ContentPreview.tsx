import { useEffect, useState } from 'react';
import PostBox from '../PostBox/PostBox';
import PostBoxPre from '../PostBox/PostBoxPre';
import HeadMenuList from '../Recycle/HeadMenuList/HeadMenuList';
import style from './userpage.module.css';
import { PostDTO } from '../Post/Post';
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';
import { PostPageResultDTO } from '../Search/Search';
import PostList from '../UserContents/PostList/PostList';

type Props = {
    user: string,
    title: string,
    sort: number,
    size: number,
    className?: string
}

export default function UserPageContentPreview({ title, user, sort, size, className = '' }: Props) {
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

    return <HeadMenuList title={title} menu='모두 보기' to={`/user/${user}/content?sort=${sort}`} className={`${style.list} ${className} screen_container`}>
        <PostList data={list} preAmount={size} showUser={false} />
    </HeadMenuList>
}