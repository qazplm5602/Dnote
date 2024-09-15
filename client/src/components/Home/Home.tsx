import style from './home.module.css';
import Logo from '../../assets/Dnote.svg'
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
    return <main>
        <Title />
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