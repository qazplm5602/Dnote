import { IconButton } from '../Recycle/Button';
import style from './search.module.css';

import arrowIcon from '../../assets/icons/ic-round-navigate-before.svg';
import PostBox from '../PostBox/PostBox';
import Footer from '../Footer/Footer';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { PostDTO } from '../Post/Post';
import LoadBox from '../Recycle/LoadBox';
import { numberWithCommas } from '../Utils/misc';
import request from '../Utils/request';
import PostBoxPre from '../PostBox/PostBoxPre';
import { useChangeSearchOption, useSearchOption } from './SearchHooks';

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
            <Head total={total} loading={loading} />
            {loading ? <ListPre /> : <List data={list} />}
            <Pagination />
        </main>
        <Footer />
    </>;
}

function Head({ total, loading }: { total: number, loading: boolean }) {
    const { query } = useSearchOption();

    return <section className={style.head}>
        <div className={style.info}><span className={`domi_gradient ${style.keyword}`}>{query}</span>에 대한 검색 결과 총 <strong className={style.amount}>{loading ? <LoadBox className={style.load} /> : numberWithCommas(total)}</strong>개의 포스트를 찾았습니다.</div>
        <SortSection />
    </section>;
}

const sortButtons = [
    "연관",
    "최신",
    "인기",
];

function SortSection() {
    const { sort } = useSearchOption();
    const changeOption = useChangeSearchOption();
    
    const changeSort = function(idx: number) {
        changeOption({
            sort: idx.toString()
        });
    }

    return <section className={style.sort}>
        {sortButtons.map((v, i) => <button className={(i.toString() === sort) ? style.active : ''} onClick={() => changeSort(i)} key={v}>{v}순</button>)}
    </section>;
}

function Pagination() {
    return <section className={style.pagination}>
        <button className={style.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <IconButton icon={arrowIcon} className={[style.icon]} />
    </section>;
}

function List({ data }: { data: PostDTO[] }) {
    console.log(data);
    return <section className={style.list}>
        {data.map(v => <PostBox key={v.id} className={style.item} />)}
    </section>;
}

function ListPre() {
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