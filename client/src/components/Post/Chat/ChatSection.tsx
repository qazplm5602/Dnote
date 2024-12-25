import style from '../post.module.css';

import { useEffect, useRef, useState } from "react";
import PostChatBox, { PostChatDTO } from "./ChatBox";
import request from "../../Utils/request";
import { ReplyMoreButton } from "./ChatMoreButton";
import Spinner from "../../Recycle/Spinner";
import { PostChatNewDTO } from './ChatList';

type Props = {
    chat: PostChatNewDTO,
}
export default function PostChatSection({ chat }: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ replies, setReplies ] = useState<PostChatDTO[]>([]);
    const firstLoadTimeRef = useRef(new Date());
    const pageRef = useRef(-1);

    const nextPageLoad = async function() {
        if (loading || chat.reply_count == 0) return;

        pageRef.current++;
        setLoading(true);
        
        const response = await request<PostChatDTO[]>(`chat/${chat.id}/reply?time=${Number(firstLoadTimeRef.current)}&page=${pageRef.current}`);
        setReplies(prev => [...prev, ...response.data]);
        setLoading(false);
    }

    useEffect(() => {
        setReplies([]);
        firstLoadTimeRef.current = new Date();
        pageRef.current = -1;
    }, [ chat ]);
    
    return <>
        <PostChatBox data={chat} replyOpen={pageRef.current >= 0} onReplyOpen={nextPageLoad} newChat={chat.newChat} />

        {/* 답글 리스트 */}
        {replies.map(v => <PostChatBox key={v.id} data={v} />)}
        {(pageRef.current !== -1 && !loading && replies.length < chat.reply_count) && <ReplyMoreButton onClick={nextPageLoad} />}
        {loading && <Spinner className={`${style.reply_left} ${style.reply_spinner}`} />}
        {replies.length > 0 && <div style={{marginBottom: '25px'}}></div>}
    </>;
}