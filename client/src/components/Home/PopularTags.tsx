import { useEffect, useState } from 'react';
import style from './home.module.css';
import request from '../Utils/request';
import LoadBox from '../Recycle/LoadBox';
import { Link } from 'react-router-dom';

export default function HomePopularTags() {
    const [ list, setList ] = useState<string[] | null>(null);

    useEffect(() => {
        let alive = true;
        
        const onLoad = async function() {
            const result = await request<string[]>("post/popular/tag");
            if (!alive) return;

            setList(result.data);
        }
        onLoad();

        return () => {
            alive = false;
        }
    }, []);

    if (list && list.length === 0) return; // 없네 ㅡㅡ;;

    return <section className={style.popular_tags}>
        <h4 className={style.title}>인기 태그</h4>
        {!list && <LoadingBoxs />}
        {list && list.map(v => <Link key={v} to={`/search?query=${encodeURIComponent('#' + v)}`}>#{v}</Link>)}
    </section>;
}

function LoadingBoxs() {
    return <>
        <LoadBox className={style.loading} delay={0} />
        <LoadBox className={style.loading} delay={100} />
        <LoadBox className={style.loading} delay={200} />
        <LoadBox className={style.loading} delay={300} />
    </>;
}