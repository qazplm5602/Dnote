import { useRef, useState } from 'react';
import style from '../post.module.css';
import PostChatInput from './ChatInput';
import PostChatList, { ChatAddEventCb } from './ChatList';
import ChatTitle from './ChatTitle';

export default function PostChatMain() {
    const [ chatCount, setChatCount ] = useState<number | null>(null);
    const chatAddEventRef = useRef<ChatAddEventCb>();
    const onChatAdd: ChatAddEventCb = function(id, content) {
        if (chatCount)
            setChatCount(chatCount + 1);

        if (chatAddEventRef.current)
            chatAddEventRef.current(id, content);
    }

    return <section className={style.chat_main}>
        <ChatTitle value={chatCount} setValue={setChatCount} />
        <PostChatInput onChatAdd={onChatAdd} />
        <PostChatList chatSize={chatCount} addEventRef={chatAddEventRef} />
    </section>;
}