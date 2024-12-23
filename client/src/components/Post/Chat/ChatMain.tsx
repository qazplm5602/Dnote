import { useState } from 'react';
import style from '../post.module.css';
import PostChatInput from './ChatInput';
import PostChatList from './ChatList';
import ChatTitle from './ChatTitle';

export default function PostChatMain() {
    const [ chatCount, setChatCount ] = useState<number | null>(null);

    return <section className={style.chat_main}>
        <ChatTitle value={chatCount} setValue={setChatCount} />
        <PostChatInput />
        <PostChatList />
    </section>;
}