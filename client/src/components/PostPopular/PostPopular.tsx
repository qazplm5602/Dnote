import style from './postPopular.module.scss';
import PostList from "../UserContents/PostList/PostList";

import trandUpIcon from '../../assets/icons/trending-up.svg';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import { PostDTO } from '../Post/Post';
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';
import MetaTag from '../MetaTag/MetaTag';

export default function PostPopular() {
    const [ list, setList ] = useState<PostDTO[] | null>(null);

    const loadData = async function(aliveRef: aliveType) {
        const result = await request<PostDTO[]>("post/popular");
        if (!aliveRef.alive) return;

        setList(result.data);
    }

    useEffect(() => {
        const aliveRef = { alive: true };

        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, []);

    return <main>
        <Header />
        <PostList data={list} className="screen_container" />
        <Footer />
    </main>;
}

function Header() {
    return <section className={`screen_container ${style.header}`}>
        <MetaTag title={"최근 트렌드"} />
        <img src={trandUpIcon} className={style.icon} />
        <h1>최근 트렌드</h1>
    </section>
}