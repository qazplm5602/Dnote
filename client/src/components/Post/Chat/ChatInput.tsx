import { useSelector } from 'react-redux';
import Button from '../../Recycle/Button';
import style from '../post.module.css';
import { RootState } from '../../Redux/Store';

export default function PostChatInput() {
    const logined = useSelector<RootState, boolean>(v => v.user.logined);
    
    return <article className={style.input_container}>
        <textarea placeholder={logined ? '내용을 입력하세요.' : '로그인 후 이용 가능합니다.'} disabled={!logined}></textarea>
        <Button>전송</Button>
    </article>;
}