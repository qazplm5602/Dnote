import style from '../post.module.css';
import { IconButton } from "../../Recycle/Button";

import otherSvg from '../../../assets/icons/other.svg'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { setMenuShow } from '../../Redux/ContextMenuStateSlice';
import { useRef } from 'react';
import { LoginState } from '../../Redux/LoginStateSlice';

type Props = {
    chatId: number,
    ownerId: number
}
export default function PostChatOther({ chatId, ownerId }: Props) {
    const user = useSelector<RootState, LoginState>(v => v.user);
    const dispatch = useDispatch();
    const nodeRef = useRef<HTMLButtonElement>(null);

    const onEdit = function() {
        console.log("onEdit");
    }
    const onRemove = function() {
        console.log("onRemove");
    }

    const onShowMenu = function() {
        if (nodeRef.current === null) return;

        const pos = {
            left: nodeRef.current.offsetLeft - window.scrollX,
            top: nodeRef.current.offsetTop - window.scrollY,
        }

        dispatch(setMenuShow({
            menus: [
                { text: "수정", callback: onEdit},
                { text: "삭제", callback: onRemove},
            ],
            pos
        }));
    }

    return (user.logined && user.id === ownerId) && <IconButton icon={otherSvg} className={[style.other]} onClick={onShowMenu} domiRef={nodeRef} />
}