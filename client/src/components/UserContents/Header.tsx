import TypeSelect from '../Recycle/TypeSelect/TypeSelect';
import style from './userContents.module.scss';

const sortTypes = ["인기순", "최신순", "오래된순"];

export default function UserContentsHeader() {
    return <section className={`screen_container ${style.header}`}>
        <h1>도미님의 포스트</h1>
        <TypeSelect list={sortTypes} current={0} />
    </section>;
}