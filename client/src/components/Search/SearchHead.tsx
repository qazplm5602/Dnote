import LoadBox from '../Recycle/LoadBox';
import TypeSelect from '../Recycle/TypeSelect/TypeSelect';
import { numberWithCommas } from '../Utils/misc';
import style from './search.module.css';
import { useChangeSearchOption, useSearchOption } from './SearchHooks';

export default function SearchHead({ total }: { total: number }) {
    const { query } = useSearchOption();

    return <section className={style.head}>
        <div className={style.info}><span className={`domi_gradient ${style.keyword}`}>{query}</span>에 대한 검색 결과 총 <strong className={style.amount}>{total === -1 ? <LoadBox className={style.load} /> : numberWithCommas(total)}</strong>개의 포스트를 찾았습니다.</div>
        <SortSection />
    </section>;
}

const sortButtons = [
    "연관순",
    "최신순",
    "인기순",
];

function SortSection() {
    const { sort } = useSearchOption();
    const changeOption = useChangeSearchOption();
    
    const changeSort = function(idx: number) {
        changeOption({
            sort: idx.toString()
        });
    }

    return <TypeSelect list={sortButtons} current={Number(sort)} onSelect={changeSort} />;
}