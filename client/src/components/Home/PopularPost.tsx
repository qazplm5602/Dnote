import style from './home.module.css';

import HeadMenuList from "../Recycle/HeadMenuList/HeadMenuList";
import { PostDTO } from '../Post/Post';
import { useEffect, useState } from 'react';
import { aliveType } from '../Utils/misc';
import request from '../Utils/request';
import IconText from '../Recycle/IconText';

import trandIcon from '../../assets/icons/trending-up.svg';
import PostList from '../UserContents/PostList/PostList';

const ITEM_SIZE = 8;

export default function HomePopularPost() {
    const [ list, setList ] = useState<PostDTO[] | null>(null);

    const loadData = async function(aliveRef: aliveType) {
        const result = await request<PostDTO[]>("post/popular", { params: { size: ITEM_SIZE } });
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

    return <HeadMenuList title={<IconText icon={trandIcon} text='최근 트렌드' />} menu='더보기' to='/post/popular' className={`screen_container ${style.popular_list}`}>
        <PostList data={list} preAmount={ITEM_SIZE} />
    </HeadMenuList>;
}