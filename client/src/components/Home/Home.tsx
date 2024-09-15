import style from './home.module.css';
import { useEffect, useMemo, useState } from 'react';

import Logo from '../../assets/Dnote.svg'
import SearchIcon from '../../assets/icons/ic-search.svg';
import CloseIcon from '../../assets/icons/ic-close-solid.svg';

export default function Home() {
    return <main>
        <Title />
        <SearchSection />
    </main>;
}

const titleList = [
    "개발",
    "여행",
    "음악",
    "독서",
    "영화",
    "운동",
    "요리",
    "자기계발",
    "취미",
    "건강",
    "패션",
    "예술",
    "비즈니스",
    "교육",
    "테크놀로지",
    "사회"
];

function Title() {
    const [idx, setIdx] = useState(0);
    const [show, setShow] = useState(true);

    const width = useMemo(() => titleList[idx].length * 21.2, [idx]);

    useEffect(() => {
        let waitHandler: NodeJS.Timeout;

        const next = () => {
            waitHandler = setTimeout(() => {
                setShow(false);
                waitHandler = setTimeout(() => {
                    setIdx(prev => {
                        let nextId = prev + 1;
                        if (nextId >= titleList.length) nextId = 0;
                        return nextId;
                    });
                    
                    waitHandler = setTimeout(() => {
                        setShow(true);
                        next();
                    }, 300);

                }, 300);
            }, 3000);
        }

        next();

        return () => clearTimeout(waitHandler);
    }, []);

    return <section className={style.title_section}>
        <img src={Logo} />
        <div>다른 사람들의 <div className={style.text} style={{ width: `${width}px`, opacity: show ? 1 : 0 }}>{titleList[idx]}</div> 이야기를 들어보세요.</div>
    </section>
}

function SearchSection() {
    return <section className={style.search_main}>
        <SearchBox />
        <PopularTags />
    </section>;
}

function SearchBox() {
    return <div className={style.search_box}>
        <img className={style.icon} src={SearchIcon} />
        <input type="text" placeholder='검색' />
        
        <button className={style.clear}>
            <img src={CloseIcon} />
        </button>
    </div>;
}

function PopularTags() {
    return <section className={style.popular_tags}>
        <div>#linux</div>
        <div>#spring</div>
        <div>#javascript</div>
        <div>#react</div>
        <div>#jquery</div>
        <div>#unity</div>
    </section>;
}