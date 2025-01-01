import { IconButton } from '../Button';
import style from './pagenation.module.scss';

import arrowIcon from '../../../assets/icons/ic-round-navigate-before.svg';
import { useMemo } from 'react';
import LoadBox from '../LoadBox';

type Props = {
    total: number,
    page: number,
    size?: number,
    onSetPage?: (page: number) => void
}

const PAGE_BTN_SIZE = 5; // 5개씩

export default function Pagenation({ total, page, size = 16, onSetPage }: Props) {
    const maxNum = Math.max(1, Math.ceil(total / size));
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
        sendPageEvent(startNum - 1);
    }
    const onEndPage = function() {
        sendPageEvent(endNum + 1);
    }
    const sendPageEvent = function(i: number) {
        if (onSetPage)
            onSetPage(i);
    }

    if (total === -1)
        return <PagenationPre page={page} />;

    return <section className={style.pagination}>
        {startNum > 1 && <IconButton icon={arrowIcon} className={[style.icon, style.revert]} onClick={onFirstPage} />}
        {btns.map(v => <button className={page === v ? style.active : ''} key={v} onClick={() => sendPageEvent(v)}>{v}</button>)}
        {maxNum > endNum && <IconButton icon={arrowIcon} className={[style.icon]} onClick={onEndPage} />}
    </section>
}

function PagenationPre({ page }: { page: number }) {
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