import style from './search.module.css';

import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import { PostDTO } from '../Post/Post';
import request from '../Utils/request';
import {  useSearchOption } from './SearchHooks';
import SearchHead from './SearchHead';
import SearchPagination from './SearchPagenation';
import SearchList, { SearchListPre } from './SearchList';

const ITEM_SIZE = 16; // 한 페이지에 16개

interface PostSearchResultDTO {
    total: number,
    posts: PostDTO[]
}

export default function Search() {
    const { page, query, sort } = useSearchOption();

    const [ loading, setLoading ] = useState(true);
    const [ total, setTotal ] = useState(0);
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
        loadData();
    }, [page, query, sort]);

    return <>
        <main className={`screen_container ${style.main}`}>
            <SearchHead total={total} loading={loading} />
            {loading ? <SearchListPre /> : <SearchList data={list} />}
            <SearchPagination />
        </main>
        <Footer />
    </>;
}