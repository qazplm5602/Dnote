import { useSelector } from 'react-redux';
import style from './contextMenu.module.scss';
import { forwardRef } from "react";
import { RootState } from '../Redux/Store';

const ContextMenuBox = forwardRef<HTMLDivElement>((_, ref) => {
    // const data = useSelector<RootState>(v => v.contextMenu.pos);

    return <section ref={ref} className={style.context_menu}>
        <div>테스트 1</div>
        <div>테스트 2</div>
        <div>테스트 3</div>
    </section>
});

export default ContextMenuBox;