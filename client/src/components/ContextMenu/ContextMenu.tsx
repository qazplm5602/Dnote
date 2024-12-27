import style from './contextMenu.module.scss';

import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { CSSTransition } from 'react-transition-group';
import ContextMenuBox from './Box';
import { useRef } from 'react';

const animStyles = {
    enter: style.enter,
    enterActive: style.enter_active,
    exit: style.exit,
    exitActive: style.exit_active
}

export default function ContextMenu() {
    const show = useSelector<RootState, boolean>(v => v.contextMenu.show);
    const nodeRef = useRef<HTMLDivElement>(null);

    return <CSSTransition nodeRef={nodeRef} timeout={300} unmountOnExit in={show} classNames={animStyles}>
        <article className={style.main}>
            <ContextMenuBox ref={nodeRef} />
        </article>
    </CSSTransition>;
}

