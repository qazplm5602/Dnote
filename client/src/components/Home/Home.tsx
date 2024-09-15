import style from './home.module.css';
import Logo from '../../assets/Dnote.svg'

export default function Home() {
    return <main>
        <Title />
    </main>;
}

function Title() {
    return <section className={style.title_section}>
        <img src={Logo} />
        <div>다른 사람들의 <span>개발</span> 이야기를 들어보세요.</div>
    </section>
}