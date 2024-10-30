import { CSSTransition } from "react-transition-group";
import style from './write.module.css';

import closeSvg from '../../assets/icons/ic-round-close.svg';
import trashSvg from '../../assets/icons/trash.svg';
import { IconButton } from '../Recycle/Button';
import { useRef } from "react";

export default function WriteTemp({ show, onClose }: { show: boolean, onClose: () => void }) {
    const nodeRef = useRef(null);
    
    const onBGClick = function() {
        onClose();
    }
    
    const onBoxClick = function(e: React.MouseEvent) {
        e.stopPropagation();
    }
    
    return <CSSTransition in={show} nodeRef={nodeRef} unmountOnExit timeout={300} classNames={{
        enter: style.enter,
        enterActive: style.enter_active,
        exit: style.exit,
        exitActive: style.exit_active
    }} >
        <article ref={nodeRef} className={style.temp_main} onClick={onBGClick}>
            <div className={style.box} onClick={onBoxClick}>
                <Head onClose={onClose} />
                <List />
            </div>
        </article>
    </CSSTransition>;
}

function Head({ onClose }: { onClose: () => void }) {
    return <section className={style.head}>
        <h2>임시글 목록</h2>

        <button className={style.close_btn} onClick={onClose}>
            <img src={closeSvg} />
        </button>
    </section>;
}

function List() {
    return <section className={style.list}>
        <Box />
    </section>;
}

function Box() {
    return <div className={style.item}>
        <div className={style.detail}>
            <div className={style.title}>이것은 제목임니다.</div>
            <div className={style.sub}>2024-09-15</div>
        </div>

        <div className={style.interaction}>
            <IconButton icon={trashSvg} />
        </div>
    </div>;
}