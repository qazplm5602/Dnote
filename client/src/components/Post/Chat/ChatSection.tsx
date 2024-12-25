import style from '../post.module.css';

import { useEffect, useRef, useState } from "react";
import PostChatBox, { PostChatDTO } from "./ChatBox";
import request from "../../Utils/request";
import { ReplyMoreButton } from "./ChatMoreButton";
import Spinner from "../../Recycle/Spinner";
import { ChatAddEventCb, PostChatNewDTO } from './ChatList';
import PostChatInput from './ChatInput';
import { RootState } from '../../Redux/Store';
import { LoginState } from '../../Redux/LoginStateSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type Props = {
    chat: PostChatNewDTO,
}
export default function PostChatSection({ chat }: Props) {
    const [ chatCopy, setChatCopy ] = useState(chat);
    const [ loading, setLoading ] = useState(false);
    const [ replies, setReplies ] = useState<PostChatDTO[]>([]);
    const [ showInput, setShowInput ] = useState(false);
    const firstLoadTimeRef = useRef(new Date());
    const pageRef = useRef(-1);
    const loginUser = useSelector<RootState, LoginState>(v => v.user);
    const navigate = useNavigate();

    const newReplyChat: ChatAddEventCb = function(id, content) {
        const newChat: PostChatDTO = {
            id,
            created: new Date().toString(),
            content,
            owner: {
                id: loginUser.id,
                avatar: loginUser.avatar,
                name: loginUser.name
            },
            good: 0,
            reply_count: 0,
            reply: chat.id
        };

        setReplies(prev => [newChat, ...prev]);
        setChatCopy(prev => ({...prev, reply_count: prev.reply_count + 1}));
        setShowInput(false);
    }
    const nextPageLoad = async function() {
        if (loading || chat.reply_count == 0) return;

        pageRef.current++;
        setLoading(true);
        
        const response = await request<PostChatDTO[]>(`chat/${chat.id}/reply?time=${Number(firstLoadTimeRef.current)}&page=${pageRef.current}`);
        setReplies(prev => [...prev, ...response.data]);
        setLoading(false);
    }
    const onInputShow = function() {
        if (!loginUser.logined) {
            navigate("/login");
            return;
        }
        setShowInput(true);
    }
    const onInputClose = function() {
        setShowInput(false);
    }

    useEffect(() => {
        setChatCopy(chat);
        setReplies([]);
        firstLoadTimeRef.current = new Date();
        pageRef.current = -1;
    }, [ chat ]);
    
    return <>
        <PostChatBox data={chatCopy} replyOpen={pageRef.current >= 0} onReplyOpen={nextPageLoad} onReplyInput={onInputShow} newChat={chat.newChat} />
        {showInput && <PostChatInput reply={chat.id} onChatAdd={newReplyChat} onClose={onInputClose} />}

        {/* 답글 리스트 */}
        {replies.map(v => <PostChatBox key={v.id} data={v} />)}
        {(pageRef.current !== -1 && !loading && replies.length < chatCopy.reply_count) && <ReplyMoreButton onClick={nextPageLoad} />}
        {loading && <Spinner className={`${style.reply_left} ${style.reply_spinner}`} />}
        {replies.length > 0 && <div style={{marginBottom: '25px'}}></div>}
    </>;
}