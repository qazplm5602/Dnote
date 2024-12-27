import { useDispatch, useSelector } from 'react-redux';
import style from './contextMenu.module.scss';
import { forwardRef } from "react";
import { RootState } from '../Redux/Store';
import { ContextMenuState, setMenuHide } from '../Redux/ContextMenuStateSlice';

const ContextMenuBox = forwardRef<HTMLDivElement>((_, ref) => {
    const data = useSelector<RootState, ContextMenuState>(v => v.contextMenu);
    const dispatch = useDispatch();
    const posStyle = {
        left: `${data.pos.left}px`,
        top: `${data.pos.top}px`
    };
    const onItemClick = function(idx: number) {
        const callback = data.menus[idx].callback;
        dispatch(setMenuHide()); // 메뉴 닫고
        callback();
    }
    const onBoxClick = function(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
    }

    return <section ref={ref} className={style.context_menu} style={posStyle} onClick={onBoxClick}>
        {data.menus.map((v, i) => <div key={v.text} onClick={() => onItemClick(i)}>{v.text}</div>)}
    </section>
});

export default ContextMenuBox;