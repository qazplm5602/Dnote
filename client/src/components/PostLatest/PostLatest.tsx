import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Pagenation from "../Recycle/Pagenation/Pagenation";
import { useChangeSearchOption, useSearchOption } from "../Search/SearchHooks";
import PostList from "../UserContents/PostList/PostList";
import PostLatestHead from "./Head";
import { PostDTO } from "../Post/Post";
import { aliveType } from "../Utils/misc";
import request from "../Utils/request";
import { PostPageResultDTO } from "../Search/Search";

const ITEM_SIZE = 20;

export default function PostLatest() {
    const { page } = useSearchOption();
    const setSearchOption = useChangeSearchOption();
    const [ list, setList ] = useState<PostDTO[] | null>(null);
    const [ total, setTotal ] = useState<number | null>(null);

    const loadData = async function(aliveRef: aliveType) {
        const result = await request<PostPageResultDTO>("post/latest", { params: { size: ITEM_SIZE, page: Number(page) - 1 } });
        if (!aliveRef.alive) return;

        setList(result.data.posts);

        if (total === null)
            setTotal(result.data.total);
    }
    
    const handleSetPage = function(value: number) {
        setSearchOption({ page: value.toString() });
    }

    useEffect(() => {
        const aliveRef = { alive: true };
        
        setList(null);
        loadData(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [ page ]);

    return <main>
        <PostLatestHead />
        <PostList className="screen_container" data={list} />
        <Pagenation total={total || 0} page={Number(page)} onSetPage={handleSetPage} size={ITEM_SIZE} />

        <Footer />
    </main>
}