import { IconButton } from "../../Recycle/Button";
import otherSvg from '../../../assets/icons/other.svg';

import style from '../post.module.css';
import { useDispatch, useSelector } from "react-redux";
import { setMenuShow } from "../../Redux/ContextMenuStateSlice";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../Redux/Store";
import { LoginState } from "../../Redux/LoginStateSlice";
import request from "../../Utils/request";
import { useNotify } from "../../Notify/NotifyContext";

export default function PostOtherMenu() {
    const { id, user } = useParams();
    const loginUser = useSelector<RootState, LoginState>(v => v.user);

    const dispatch = useDispatch();
    const domiRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const notify = useNotify();
    
    if (id === undefined || user === undefined || !loginUser.logined || loginUser.id !== Number(user)) return;

    const onEdit = function() {
        
    }
    const onRemove = function() {
        const accept = confirm("게시물을 삭제하시겠습니까?");
        if (!accept) return;

        request(`post/remove/${id}`, { method: "DELETE" })
        .then(() => {
            notify("Success", "작업이 완료되었습니다.", 5000);
            navigate(`/user/${user}`);
        })
        .catch(() => notify("Error", "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", 5000));
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