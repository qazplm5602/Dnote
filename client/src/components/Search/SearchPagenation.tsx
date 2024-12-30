import style from './search.module.css';

import { IconButton } from "../Recycle/Button";
import arrowIcon from '../../assets/icons/ic-round-navigate-before.svg';

export default function SearchPagination() {
    return <section className={style.pagination}>
        <button className={style.active}>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <IconButton icon={arrowIcon} className={[style.icon]} />
    </section>;
}