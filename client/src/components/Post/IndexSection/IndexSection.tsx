import style from '../post.module.css';

export default function PostIndexSection() {
    return <article className={style.index}>
        <h2>목차</h2>
        <IndexList />
    </article>;
}

function IndexList() {
    return <ul>
        <li className={style.h1}>React가 머야</li>
        <li className={style.h2}>훅 다뤄보기</li>
        <Item />
        <li className={style.h3}>useRef</li>
        <li className={style.h3}>useEffect</li>
        <li className={style.h3}>useTransition</li>
        <li className={style.h4}>비슷한 훅</li>
    </ul>
}

function Item() {
    return <li className={style.h3}><div className={style.circle}></div>useState</li>
}