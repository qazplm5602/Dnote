import style from './write.module.css';

import closeSvg from '../../assets/icons/ic-round-close.svg';
import trashSvg from '../../assets/icons/trash.svg';
import { IconButton } from '../Recycle/Button';

export default function WriteTemp() {
    return <article className={style.temp_main}>
        <div className={style.box}>
            <Head />
            <List />
        </div>
    </article>;
}

function Head() {
    return <section className={style.head}>
        <h2>임시글 목록</h2>

        <button className={style.close_btn}>
            <img src={closeSvg} />
        </button>
    </section>;
}

function List() {
    return <section className={style.list}>
        <Box />
    </section>;
}

function Box() {
    return <div className={style.item}>
        <div className={style.detail}>
            <div className={style.title}>이것은 제목임니다.</div>
            <div className={style.sub}>2024-09-15</div>
        </div>

        <div className={style.interaction}>
            <IconButton icon={trashSvg} />
        </div>
    </div>;
}