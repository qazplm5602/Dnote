import style from './search.module.css';

export default function Search() {
    return <main className={`screen_container ${style.main}`}>
        <Head />
    </main>;
}

function Head() {
    return <section className={style.head}>
        <div className={style.info}><span className={`domi_gradient ${style.keyword}`}>예시</span>에 대한 검색 결과 총 <strong className={style.amount}>1,891</strong>개의 포스트를 찾았습니다.</div>
        <SortSection />
    </section>;
}

function SortSection() {
    return <section className={style.sort}>
        <button className={style.active}>연관순</button>
        <button>최신순</button>
        <button>인기순</button>
    </section>;
}