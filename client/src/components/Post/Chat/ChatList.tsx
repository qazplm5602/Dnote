import style from '../post.module.css';
import PostChatBox from "./ChatBox";
import { MoreButton, ReplyMoreButton } from './ChatMoreButton';

export default function PostChatList() {
    return <article className={style.list}>
        <PostChatBox />
        <PostChatBox />

        <ReplyMoreButton />
        <MoreButton />
    </article>;
}