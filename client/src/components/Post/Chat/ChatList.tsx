import { useEffect, useRef, useState } from 'react';
import style from '../post.module.css';
import PostChatBox, { PostChatDTO } from "./ChatBox";
import { MoreButton, ReplyMoreButton } from './ChatMoreButton';
import { useParams } from 'react-router-dom';
import request from '../../Utils/request';
import PostChatSection from './ChatSection';
import { aliveType } from '../../Utils/misc';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { LoginState } from '../../Redux/LoginStateSlice';

export type ChatAddEventCb = (id: number, content: string) => void;
export type ChatRemoveEventCb = (id: number) => void;
type Props =  {
    chatSize: number | null,
    addEventRef: React.MutableRefObject<ChatAddEventCb | undefined>,
    onChatRemove?: ChatRemoveEventCb
}

export interface PostChatNewDTO extends PostChatDTO {
    newChat?: boolean
}

export default function PostChatList({ chatSize, addEventRef, onChatRemove }: Props) {
    const loginUser = useSelector<RootState, LoginState>(v => v.user);
    const { id, user } = useParams();
    
    const [ loading, setLoading ] = useState(false);
    const [ list, setList ] = useState<PostChatNewDTO[]>([]);
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
    const onNewChat: ChatAddEventCb = function(id, content) {
        if (!loginUser.logined) return; // 로그인 중이 아니면 추가할 수 없음음

        const newChat:PostChatNewDTO = {
            id,
            created: new Date().toString(),
            content,
            owner: {
                id: loginUser.id,
                avatar: loginUser.avatar,
                name: loginUser.name
            },
            good: 0,
            my_good: false,
            reply_count: 0,
            reply: undefined,
            newChat: true
        };

        setList(prev => [newChat, ...prev]);
    }
    const onRemoveChat = function(chatId: number) {
        setList(prev => {
            const idx = prev.findIndex(v => v.id === chatId);
            if (idx === -1) return prev;
            
            prev.splice(idx, 1);
            return [...prev];
        });

        if (onChatRemove)   
            onChatRemove(chatId);
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
    
    useEffect(() => {
        addEventRef.current = onNewChat;
    }, []);

    return <article className={style.list}>
        {list.map(v => <PostChatSection key={v.id} chat={v} onRemove={() => onRemoveChat(v.id)} />)}
        {/* <PostChatBox /> */}

        {(chatSize != null && list.length < chatSize) && <MoreButton onClick={() => nextPageLoad({alive: true})} loading={loading} />}
        {/* <ReplyMoreButton /> */}
    </article>;
}