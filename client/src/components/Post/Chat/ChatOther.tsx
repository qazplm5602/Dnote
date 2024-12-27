import style from '../post.module.css';
import { IconButton } from "../../Recycle/Button";

import otherSvg from '../../../assets/icons/other.svg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { setMenuShow } from '../../Redux/ContextMenuStateSlice';
import { useRef } from 'react';
import { LoginState } from '../../Redux/LoginStateSlice';
import request from '../../Utils/request';
import { useNotify } from '../../Notify/NotifyContext';

type Props = {
    chatId: number,
    ownerId: number,
    onRemove?: () => void,
    onEdit?: () => void
}
export default function PostChatOther({ chatId, ownerId, onRemove: onChatRemove, onEdit }: Props) {
    const user = useSelector<RootState, LoginState>(v => v.user);
    const dispatch = useDispatch();
    const nodeRef = useRef<HTMLButtonElement>(null);
    const notify = useNotify();

    const onRemove = function() {
        const result = confirm("해당 댓글을 삭제 하시겠습니까?");
        if (!result) return;
        
        request(`post/chat/${chatId}`, { method: "DELETE" })
        .then(() => {
            if (onChatRemove)
                onChatRemove();
        })
        .catch(() => {
            notify('Error', "댓글을 삭제 할 수 없습니다. 나중에 다시 시도하세요.", 5000)
        });
    }

    const onShowMenu = function() {
        if (nodeRef.current === null) return;

        const pos = {
            left: nodeRef.current.offsetLeft - window.scrollX,
            top: nodeRef.current.offsetTop - window.scrollY,
        }

        const menus = [
            { text: "삭제", callback: onRemove},
        ];
        
        if (onEdit)
            menus.push({ text: "수정", callback: onEdit});

        dispatch(setMenuShow({
            menus,
            pos
        }));
    }

    return (user.logined && user.id === ownerId) && <IconButton icon={otherSvg} className={[style.other]} onClick={onShowMenu} domiRef={nodeRef} />
}