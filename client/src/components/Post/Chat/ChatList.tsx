import { useEffect, useRef, useState } from 'react';
import style from '../post.module.css';
import PostChatBox, { PostChatDTO } from "./ChatBox";
import { MoreButton, ReplyMoreButton } from './ChatMoreButton';
import { useParams } from 'react-router-dom';
import request from '../../Utils/request';
import PostChatSection from './ChatSection';
import { aliveType } from '../../Utils/misc';

export default function PostChatList({ chatSize }: { chatSize: number | null }) {
    const { id, user } = useParams();
    
    const [ loading, setLoading ] = useState(false);
    const [ list, setList ] = useState<PostChatDTO[]>([]);
    const pageRef = useRef(-1);
    const firstLoadTimeRef = useRef(new Date());

    const nextPageLoad = async function(aliveRef: aliveType) {
        if (loading) return;

        pageRef.current++;
        setLoading(true);

        const response = await request<PostChatDTO[]>(`post/${user}/${id}/chat?page=${pageRef.current}`);
        if (!aliveRef.alive) return;

        setList(prev => [...prev, ...response.data]);
        setLoading(false);
    }
 
    useEffect(() => {
        const aliveRef = { alive: true };

        setLoading(false);
        setList([]);
        pageRef.current = -1;
        firstLoadTimeRef.current = new Date();
        nextPageLoad(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [id, user]);

    return <article className={style.list}>
        {list.map(v => <PostChatSection key={v.id} chat={v} />)}
        {/* <PostChatBox /> */}

        {(chatSize != null && list.length < chatSize) && <MoreButton onClick={() => nextPageLoad({alive: true})} loading={loading} />}
        {/* <ReplyMoreButton /> */}
    </article>;
}