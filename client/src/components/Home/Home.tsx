import style from './home.module.css';
import { useEffect, useMemo, useState } from 'react';

import Logo from '../../assets/Dnote.svg'
import Footer from '../Footer/Footer';
import SearchInput from '../Search/Input/Input';
import MetaTag from '../MetaTag/MetaTag';
import HomePopularTags from './PopularTags';
import HomePostSection from './PostSection';
import IconText from '../Recycle/IconText';

import timeIcon from '../../assets/icons/recent.svg';

export default function Home() {
    return <main>
        <MetaTag title='Home' description='모두의 이야기가 당신의 로직을 완성합니다. Dnote.' keywords='Dnote, 디노트, 노트, 블로그, 도미, 글, 게시글, 포스트, post' />
        <Title />
        <SearchSection />

        {/* <img className={style.highlight_bg} src={HighlightBg} draggable={false} /> */}
        <div className={style.highlight_bg}></div>
        {/* <HighlightSection /> */}
        
        <HomePostSection
            size={4}
            title={<div className={style.title_info}>
                <div>초보자를 위한 가이드</div>
                <div>Dnote 설명서</div>
            </div>}
            uri='post/newbie'
            className={style.highlight_section}
        />
        

        {/* <HomePostSection size={8} title={<IconText icon={trandIcon} text='최근 트렌드' />} uri='post/popular' menu={{ to: "/post/popular", text: "더보기" }} className={style.popular_list} /> */}
        <HomePostSection size={4} title={<IconText icon={timeIcon} text='새로운 게시글' />} uri='post/latest' menu={{ to: "/post/latest", text: "더보기" }} className={style.latest_list} pageType={true} />

        <Footer />
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
    return <section className={`screen_container ${style.search_main}`}>
        <SearchInput className={style.search_box} />
        <HomePopularTags />
    </section>;
}