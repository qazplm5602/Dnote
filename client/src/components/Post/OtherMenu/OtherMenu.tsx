import { IconButton } from "../../Recycle/Button";
import otherSvg from '../../../assets/icons/other.svg';

import style from '../post.module.css';
import { useDispatch, useSelector } from "react-redux";
import { setMenuShow } from "../../Redux/ContextMenuStateSlice";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { RootState } from "../../Redux/Store";
import { LoginState } from "../../Redux/LoginStateSlice";

export default function PostOtherMenu() {
    const { id, user } = useParams();
    const loginUser = useSelector<RootState, LoginState>(v => v.user);

    const dispatch = useDispatch();
    const domiRef = useRef<HTMLButtonElement>(null);
    
    if (id === undefined || user === undefined || !loginUser.logined || loginUser.id !== Number(user)) return;

    const onEdit = function() {
        
    }
    const onRemove = function() {
        
    }
    
    const onClick = function() {
        if (domiRef.current === null) return;
        
        const pos = {
            top: domiRef.current.offsetTop - window.scrollY - 30,
            left: domiRef.current.offsetLeft - window.scrollX + 40,
        };
        const menus = [
            { text: "수정", callback: onEdit },
            { text: "삭제", callback: onRemove }
        ];

        dispatch(setMenuShow({
            menus,
            pos
        }));
    }

    return <IconButton className={[style.other]} icon={otherSvg} domiRef={domiRef} onClick={onClick} />
}