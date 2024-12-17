import style from '../post.module.css';
import PostChatBox from "./ChatBox";

export default function PostChatList() {
    return <article className={style.list}>
        <PostChatBox />
        <PostChatBox />
    </article>;
}