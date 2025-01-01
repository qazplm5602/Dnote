import TypeSelect from '../Recycle/TypeSelect/TypeSelect';
import { useChangeSearchOption, useSearchOption } from '../Search/SearchHooks';
import style from './userContents.module.scss';

const sortTypes = ["인기순", "최신순", "오래된순"];

type Props = {
    name: string | null
}
export default function UserContentsHeader({ name }: Props) {
    const { sort } = useSearchOption();
    const setSearchPage = useChangeSearchOption();
    
    const onSortSelect = function(i: number) {
        setSearchPage({ sort: i.toString() });
    }

    return <section className={`screen_container ${style.header}`}>
        <h1>{name}님의 포스트</h1>
        <TypeSelect list={sortTypes} current={Number(sort)} onSelect={onSortSelect} />
    </section>;
}