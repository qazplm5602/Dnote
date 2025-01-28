import style from './postLatest.module.scss';
import timeIcon from '../../assets/icons/recent.svg';

export default function PostLatestHead() {
    return <section className={`screen_container ${style.head}`}>
        <h1><img src={timeIcon} />새로운 게시글</h1>
    </section>;
}