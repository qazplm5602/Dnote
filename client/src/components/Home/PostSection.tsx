import style from './home.module.css';

import { useEffect, useState } from "react"
import HeadMenuList from "../Recycle/HeadMenuList/HeadMenuList"
import PostList from "../UserContents/PostList/PostList"
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';
import { PostPageResultDTO } from '../Search/Search';
import { PostDTO } from '../Post/Post';

type Props = {
    size: number,
    uri: string,
    title: React.ReactNode,
    menu?: { text: string, to: string },
    className?: string,
    pageType?: boolean
}

export default function HomePostSection({ uri, title, size, menu, className, pageType = false }: Props) {
    const [ list, setList ] = useState<PostDTO[] | null>(null);
    
    const loadData = async function(aliveRef: aliveType) {
        const result = await request(uri, { params: { size, page: 0 } });
        if (!aliveRef.alive) return;

        let data: PostDTO[];
        if (pageType) {
            data = (result.data as PostPageResultDTO).posts;
        } else {
            data = result.data as PostDTO[];
        }

        setList(data);
    }

    useEffect(() => {
        const aliveRef = { alive: true };
        
        setList(null);
        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, []);

    return <HeadMenuList title={title} menu={menu?.text || ""} to={menu?.to || ""} className={`screen_container ${style.post_section} ${className || ''}`}>
        <PostList data={list} preAmount={size} />
    </HeadMenuList>
}