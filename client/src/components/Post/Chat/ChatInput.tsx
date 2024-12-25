import { useSelector } from 'react-redux';
import { SpinnerButton } from '../../Recycle/Button';
import style from '../post.module.css';
import { RootState } from '../../Redux/Store';
import { useState } from 'react';
import { useNotify } from '../../Notify/NotifyContext';
import { IsStringBlank } from '../../Utils/misc';
import request from '../../Utils/request';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { ChatAddEventCb } from './ChatList';

type Props = {
    onChatAdd: ChatAddEventCb
}

export default function PostChatInput({ onChatAdd }: Props) {
    const logined = useSelector<RootState, boolean>(v => v.user.logined);
    const { id, user } = useParams();
    const [ loading, setLoading ] = useState(false);
    const [ content, setContent ] = useState("");
    
    const notify = useNotify();

    const onChangeContent = function(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setContent(e.target.value);
    }
    const onChatSend = async function() {
        if (IsStringBlank(content.trim())) {
            notify('Error', "내용을 입력하세요.", 5000);
            return;
        }

        setLoading(true);
        const response = await request<number>(`/post/${user}/${id}/chat`, { method: "POST", data: content.trim(), headers: { "Content-Type": "text/plain" } }).catch(e => e as AxiosError);
        setLoading(false);
        if (response instanceof AxiosError) {
            notify('Error', "댓글을 달 수 없습니다. 나중에 다시 시도하세요.", 5000);
            return;
        }

        onChatAdd(response.data, content.trim());
        setContent("");
    }
    
    return <article className={style.input_container}>
        <textarea placeholder={logined ? '내용을 입력하세요.' : '로그인 후 이용 가능합니다.'} disabled={!logined} value={content} onChange={onChangeContent}></textarea>
        <SpinnerButton loading={loading} className={[style.send]} onClick={onChatSend}>전송</SpinnerButton>
    </article>;
}