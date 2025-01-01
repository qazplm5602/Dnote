import { useChangeSearchOption, useSearchOption } from './SearchHooks';
import Pagenation from '../Recycle/Pagenation/Pagenation';

const ITEM_SIZE = 16; // 한 페이지에 16개

type Props = {
    total: number
}
export default function SearchPagination({ total }: Props) {
    const { page: _page } = useSearchOption();
    const setSearchOption = useChangeSearchOption();
    const page = Number(_page);

    const onSetPage = function(i: number) {
        setSearchOption({ page: i.toString() });
    }

    return <Pagenation page={page} total={total} size={ITEM_SIZE} onSetPage={onSetPage} />;
}