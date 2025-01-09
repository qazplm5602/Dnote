// import style from './userContents.module.scss';

import { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import Pagenation from '../Recycle/Pagenation/Pagenation';
import { useChangeSearchOption, useSearchOption } from '../Search/SearchHooks';
import Header from './Header';
import PostList from './PostList/PostList';
import { useParams } from 'react-router-dom';
import { aliveType } from '../Utils/misc';
import { PostDTO } from '../Post/Post';
import request from '../Utils/request';
import { PostPageResultDTO } from '../Search/Search';
import { ProfileDTO } from '../UserPage/UserPage';
import MetaTag from '../MetaTag/MetaTag';

const ITEM_SIZE = 16;

export default function UserContents() {
    const { id: user } = useParams();
    const { sort, page } = useSearchOption();
    const [ total, setTotal ] = useState(-1);
    const [ list, setList ] = useState<PostDTO[] | null>(null);
    const [ username, setUsername ] = useState<string | null>(null);
    const setSearchPage = useChangeSearchOption();

    const userId = Number(user);

    const loadData = async function(aliveRef: aliveType) {
        const params = {
            page: Number(page) - 1,
            sort,
            size: ITEM_SIZE
        };

        setList(null);
        const result = await request<PostPageResultDTO>(`post/user/${userId}`, { params });
        if (!aliveRef.alive) return; // 취소
        
        setList(result.data.posts);
        setTotal(result.data.total);
    }

    const loadUserData = async function(aliveRef: aliveType) {
        const result = await request<ProfileDTO>(`profile/${user}`);
        if (!aliveRef.alive) return;

        setUsername(result.data.user.name);
    }

    const onSetPage = function(page: number) {
        setSearchPage({ page: page.toString() });
    }

    useEffect(() => {
        if (userId === undefined || isNaN(userId)) return; // ??
        const aliveRef = { alive: true };
        
        loadData(aliveRef);
        
        return () => {
            aliveRef.alive = false;
        }
    }, [ sort, page, user ]);

    useEffect(() => {
        const aliveRef = { alive: true };

        setTotal(-1);
        loadUserData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [ user ]);

    return <main>
        <MetaTag title={username ? `${username} 포스트` : "Loading"} />
        
        <Header name={username} />
        <PostList data={list} className={'screen_container'} showUser={false} />
        <Pagenation total={total} page={Number(page)} size={ITEM_SIZE} onSetPage={onSetPage} />

        <Footer />
    </main>;
}