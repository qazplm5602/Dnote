import style from './errorPage.module.scss';
import MetaTag from "../MetaTag/MetaTag";

import errorSvg from '../../assets/icons/error.svg';
import { Link } from "react-router-dom";
import Button from "../Recycle/Button";
import Footer from '../Footer/Footer';

type Props = {
    title: string,
    desc?: string
}

export default function ErrorPage({ title, desc }: Props) {
    return <>
        <main className={style.main}>
            <MetaTag title='Not Found' />
            <img src={errorSvg} className={style.icon} />
            
            <h2>{title}</h2>
            <div className={style.sub}>{desc}</div>
            
            <Link to='/' className={style.goBack}>
                <Button>홈으로</Button>
            </Link>
        </main>
        
        <Footer />
    </>;
}