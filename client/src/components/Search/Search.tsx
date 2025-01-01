import style from './search.module.css';

import Footer from '../Footer/Footer';
import { useEffect, useRef, useState } from 'react';
import { PostDTO } from '../Post/Post';
import request from '../Utils/request';
import {  useSearchOption } from './SearchHooks';
import SearchHead from './SearchHead';
import SearchPagination from './SearchPagenation';
import { aliveType } from '../Utils/misc';
import PostList from '../UserContents/PostList/PostList';

interface PostSearchResultDTO {
    total: number,
    posts: PostDTO[]
}

export default function Search() {
    const { page, query, sort } = useSearchOption();

    const lastQueryRef = useRef("");
    const [ loading, setLoading ] = useState(true);
    const [ total, setTotal ] = useState(-1);
    const [ list, setList  ] = useState<PostDTO[]>([]);

    const loadData = async function(aliveRef: aliveType) {
        setLoading(true);
        const response = await request<PostSearchResultDTO>("post/search", { params: {
            page: Number(page) - 1,
            sort,
            query
        } });
        if (!aliveRef.alive) return;

        setLoading(false);

        const data = response.data;
        setTotal(data.total);
        setList(data.posts);
    }

    useEffect(() => {
        const aliveRef = { alive: true };
            
        if (lastQueryRef.current !== query) {
            setTotal(-1);
            lastQueryRef.current = query;
        }

        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [page, query, sort]);

    return <>
        <main className={`screen_container ${style.main}`}>
            <SearchHead total={total} />
            <PostList data={loading ? null : list} />
            <SearchPagination total={total} />
        </main>
        <Footer />
    </>;
}