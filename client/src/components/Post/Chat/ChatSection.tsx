import PostChatBox, { PostChatDTO } from "./ChatBox";

export default function PostChatSection({ chat }: { chat: PostChatDTO }) {
    

    return <>
        <PostChatBox data={chat} />
    </>;
}