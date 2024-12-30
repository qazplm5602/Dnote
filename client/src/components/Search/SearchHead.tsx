import LoadBox from '../Recycle/LoadBox';
import { numberWithCommas } from '../Utils/misc';
import style from './search.module.css';
import { useChangeSearchOption, useSearchOption } from './SearchHooks';

export default function SearchHead({ total, loading }: { total: number, loading: boolean }) {
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