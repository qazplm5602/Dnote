import LoadBox from '../../Recycle/LoadBox';
import style from '../post.module.css';

export default function PostIndexSection() {
    return <article className={style.index}>
        <h2>목차</h2>
        {/* <IndexList /> */}
        <PreList />
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

function PreList() {
    return <ul className={style.pre}>
        <LoadBox className={`${style.box} ${style.h1}`} />
        <LoadBox className={`${style.box} ${style.h2}`} delay={100} />
        <LoadBox className={`${style.box} ${style.h2}`} delay={200} />
        <LoadBox className={`${style.box} ${style.h3}`} delay={300} />
        <LoadBox className={`${style.box} ${style.h2}`} delay={400} />
        <LoadBox className={`${style.box} ${style.h3}`} delay={500} />
    </ul>;
}