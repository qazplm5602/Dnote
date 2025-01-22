import { useEffect, useState } from 'react';
import LoadBox from '../../Recycle/LoadBox';
import style from '../post.module.css';
import { useParams } from 'react-router-dom';

export type IndexInitEvent = (element: Element) => void;

export default function PostIndexSection({ initRef }: { initRef: React.MutableRefObject<IndexInitEvent | undefined> }) {
    const { id, user } = useParams();
    const [ titles, setTitles ] = useState<HTMLElement[] | null>(null);
    
    const onInit = function(el: Element) {
        console.log("Post Index Init", el);
        const list = el.querySelectorAll<HTMLElement>("h1, h2, h3, h4");
        setTitles(Object.values(list));
    }
    
    useEffect(() => {
        initRef.current = onInit;
    }, []);

    useEffect(() => {
        setTitles(null);
    }, [ id, user ]);

    return <article className={style.index}>
        <h2>목차</h2>
        {titles ? <IndexList data={titles} /> : <PreList />}
    </article>;
}

function IndexList({ data }: { data: HTMLElement[] }) {
    return <ul>
        {data.map(v => <Item key={v.textContent} el={v} />)}

        {/* <li className={style.h1}>React가 머야</li>
        <li className={style.h2}>훅 다뤄보기</li>
        
        <li className={style.h3}>useRef</li>
        <li className={style.h3}>useEffect</li>
        <li className={style.h3}>useTransition</li>
        <li className={style.h4}>비슷한 훅</li> */}
    </ul>
}

function Item({ el }: { el: HTMLElement }) {
    const [ screenIn, setScreeIn ] = useState(false);

    const onClick = function() {
        el.scrollIntoView({ behavior: "smooth", block: 'center' });
    }
    const onUpdate = function() {
        const startY = window.scrollY;
        const endY = startY + window.innerHeight;
        const currentY = el.offsetTop;

        // console.log(`${startY} ~ [${currentY}] ~ ${endY}`);
        setScreeIn(startY <= currentY && endY >= currentY);
    }

    useEffect(() => {
        window.addEventListener("scroll", onUpdate);
        window.addEventListener("resize", onUpdate);
        
        return () => {
            window.removeEventListener("scroll", onUpdate);
            window.removeEventListener("resize", onUpdate);
        }
    }, []);

    return <li className={style[el.tagName.toLocaleLowerCase()]} onClick={onClick}><div className={`${style.circle} ${screenIn ? '' : style.hide}`}></div>{el.textContent}</li>
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