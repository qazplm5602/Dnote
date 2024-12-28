import { IconButton } from '../Recycle/Button';
import style from './search.module.css';

import arrowIcon from '../../assets/icons/ic-round-navigate-before.svg';
import PostBox from '../PostBox/PostBox';
import Footer from '../Footer/Footer';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

const ITEM_SIZE = 16; // 한 페이지에 16개

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const page = useMemo(() => searchParams.get("page"), [searchParams]);
    const query = useMemo(() => searchParams.get("query"), [searchParams]);

    useEffect(() => {
        console.log("state change", page, query);
    }, [page, query]);

    return <>
        <main className={`screen_container ${style.main}`}>
            <Head />
            <List />
            <Pagination />
        </main>
        <Footer />
    </>;
}

function Head() {
    return <section className={style.head}>
        <div className={style.info}><span className={`domi_gradient ${style.keyword}`}>예시</span>에 대한 검색 결과 총 <strong className={style.amount}>1,891</strong>개의 포스트를 찾았습니다.</div>
        <SortSection />
    </section>;
}

function SortSection() {
    return <section className={style.sort}>
        <button className={style.active}>연관순</button>
        <button>최신순</button>
        <button>인기순</button>
    </section>;
}

function Pagination() {
    return <section className={style.pagination}>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <IconButton icon={arrowIcon} className={[style.icon]} />
    </section>;
}

function List() {
    return <section className={style.list}>
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
        <PostBox className={style.item} />
    </section>;
}