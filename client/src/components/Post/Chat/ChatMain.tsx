import style from '../post.module.css';
import PostChatInput from './ChatInput';
import PostChatList from './ChatList';

export default function PostChatMain() {
    return <section className={style.chat_main}>
        <h2>댓글 <span>20</span></h2>
        <PostChatInput />
        <PostChatList />
    </section>;
}