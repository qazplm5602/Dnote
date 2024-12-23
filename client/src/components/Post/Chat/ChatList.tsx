import { useEffect, useRef, useState } from 'react';
import style from '../post.module.css';
import PostChatBox, { PostChatDTO } from "./ChatBox";
import { MoreButton, ReplyMoreButton } from './ChatMoreButton';
import { useParams } from 'react-router-dom';
import request from '../../Utils/request';
import PostChatSection from './ChatSection';

export default function PostChatList({ chatSize }: { chatSize: number | null }) {
    const { id, user } = useParams();
    
    const [ loading, setLoading ] = useState(false);
    const [ list, setList ] = useState<PostChatDTO[]>([]);
    const pageRef = useRef(-1);
    const firstLoadTimeRef = useRef(new Date());

    const nextPageLoad = async function() {
        pageRef.current++;
        setLoading(true);

        const response = await request<PostChatDTO[]>(`post/${user}/${id}/chat?page=${pageRef.current}`);
        setList([...list, ...response.data]);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(false);
        setList([]);
        pageRef.current = -1;
        firstLoadTimeRef.current = new Date();
        nextPageLoad();
    }, [id, user]);

    console.log(list.length);
    return <article className={style.list}>
        {list.map(v => <PostChatSection key={v.id} chat={v} />)}
        {/* <PostChatBox /> */}

        {(chatSize != null && list.length < chatSize) && <MoreButton onClick={nextPageLoad} />}
        {/* <ReplyMoreButton /> */}
    </article>;
}