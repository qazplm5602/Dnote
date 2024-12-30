import style from './search.module.css';

import { IconButton } from "../Recycle/Button";
import arrowIcon from '../../assets/icons/ic-round-navigate-before.svg';
import { useChangeSearchOption, useSearchOption } from './SearchHooks';
import LoadBox from '../Recycle/LoadBox';
import { useMemo } from 'react';

const ITEM_SIZE = 16; // 한 페이지에 16개
const PAGE_BTN_SIZE = 5; // 5개씩

type Props = {
    total: number
}
export default function SearchPagination({ total }: Props) {
    const { page: _page } = useSearchOption();
    const setSearchOption = useChangeSearchOption();
    const page = Number(_page);

    const maxNum = Math.max(1, Math.ceil(total / ITEM_SIZE));
    const startNum = Math.max(0, Math.max(0, Math.floor((page - 1) / PAGE_BTN_SIZE)) * PAGE_BTN_SIZE) + 1;
    const endNum = Math.min(maxNum, startNum + PAGE_BTN_SIZE - 1);

    const btns = useMemo(() => {
        const result: number[] = [];

        for (let index = startNum; index <= endNum; index++) {
            result.push(index);
        }

        return result;
    }, [ total, page ]);

    const onFirstPage = function() {
        setSearchOption({ page: (startNum - 1).toString() });
    }
    const onEndPage = function() {
        setSearchOption({ page: (endNum + 1).toString() });
    }
    const onSetPage = function(i: number) {
        setSearchOption({ page: i.toString() });
    }

    if (total === -1)
        return <PagenationPre />;

    return <section className={style.pagination}>
        {startNum > 1 && <IconButton icon={arrowIcon} className={[style.icon, style.revert]} onClick={onFirstPage} />}
        {btns.map(v => <button className={page === v ? style.active : ''} key={v} onClick={() => onSetPage(v)}>{v}</button>)}
        {maxNum > endNum && <IconButton icon={arrowIcon} className={[style.icon]} onClick={onEndPage} />}
    </section>;
}

function PagenationPre() {
    const { page } = useSearchOption();

    return <section className={style.pagination}>
        <button className={style.active}>{page}</button>
        <PagenationPreBox i={0} />
        <PagenationPreBox i={1} />
        <PagenationPreBox i={2} />
        <PagenationPreBox i={3} />
        <PagenationPreBox i={4} />
    </section>;
}

function PagenationPreBox({ i }: { i: number }) {
    return <button disabled={true} className={style.pre}><LoadBox delay={i * 100} className={style.pre_box} /></button>
}