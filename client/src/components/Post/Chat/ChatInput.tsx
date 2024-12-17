import Button from '../../Recycle/Button';
import style from '../post.module.css';

export default function PostChatInput() {
    return <article className={style.input_container}>
        <textarea placeholder='내용을 입력하세요.'></textarea>
        <Button>전송</Button>
    </article>;
}