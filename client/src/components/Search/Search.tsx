import style from './search.module.css';

import Footer from '../Footer/Footer';
import { useEffect, useRef, useState } from 'react';
import { PostDTO } from '../Post/Post';
import request from '../Utils/request';
import {  useSearchOption } from './SearchHooks';
import SearchHead from './SearchHead';
import SearchPagination from './SearchPagenation';
import SearchList, { SearchListPre } from './SearchList';

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

    const loadData = async function() {
        setLoading(true);
        const response = await request<PostSearchResultDTO>("post/search", { params: {
            page: Number(page) - 1,
            sort,
            query
        } });
        setLoading(false);

        const data = response.data;
        setTotal(data.total);
        setList(data.posts);
    }

    useEffect(() => {
        console.log("state change", page, query);
        if (lastQueryRef.current !== query) {
            setTotal(-1);
            lastQueryRef.current = query;
        }

        loadData();
    }, [page, query, sort]);

    return <>
        <main className={`screen_container ${style.main}`}>
            <SearchHead total={total} />
            {loading ? <SearchListPre /> : <SearchList data={list} />}
            <SearchPagination total={total} />
        </main>
        <Footer />
    </>;
}