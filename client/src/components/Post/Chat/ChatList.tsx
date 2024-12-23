import { useEffect, useRef, useState } from 'react';
import style from '../post.module.css';
import PostChatBox, { PostChatDTO } from "./ChatBox";
import { MoreButton, ReplyMoreButton } from './ChatMoreButton';
import { useParams } from 'react-router-dom';
import request from '../../Utils/request';

export default function PostChatList() {
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

    return <article className={style.list}>
        {list.map(v => <PostChatBox data={v} />)}
        {/* <PostChatBox /> */}

        {/* <ReplyMoreButton />
        <MoreButton /> */}
    </article>;
}