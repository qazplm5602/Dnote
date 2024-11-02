import { TransitionGroup, CSSTransition } from 'react-transition-group';
import style from './notify.module.css';

import errorIco from '../../assets/icons/error.svg';
import successIco from '../../assets/icons/success.svg';
import clsoeSvg from '../../assets/icons/ic-close-solid.svg';
import { IconButton } from '../Recycle/Button';
import { createRef, forwardRef, useState } from 'react';
import { randomString } from '../Utils/misc';

export type NotifyType = 'Error' | 'Success';
interface NotifyData {
    id: string,
    type: NotifyType,
    text: string,
    nodeRef: React.RefObject<HTMLDivElement>,
    time: Date,
    timer: NodeJS.Timeout | null
}

export default function Notify() {
    const [ list, setList ] = useState<NotifyData[]>([
        {
            id: randomString(5),
            text: "ㅁㄴㅇㄹ",
            time: new Date(Date.now() + (1000 * 60)),
            nodeRef: createRef(),
            timer: null,
            type: 'Success'
        },
        {
            id: randomString(5),
            text: "ㅁㄴㅇㄹ",
            time: new Date(Date.now() + (1000 * 60)),
            nodeRef: createRef(),
            timer: null,
            type: 'Success'
        },
        {
            id: randomString(5),
            text: "ㅁㄴㅇㄹ",
            time: new Date(Date.now() + (1000 * 60)),
            nodeRef: createRef(),
            timer: null,
            type: 'Success'
        }
    ]);


    return <TransitionGroup className={style.main}>
        {list.map(v => (
            <CSSTransition
                key={v.id}
                nodeRef={v.nodeRef}
                timeout={500}
                classNames={{
                    enter: style.enter,
                    enterActive: style.enter_active,
                    exit: style.exit,
                    exitActive: style.exit_active
                }}
            >
                <Box type={v.type} text={v.text} ref={v.nodeRef} />
            </CSSTransition>
        ))}
    </TransitionGroup>;
}

const Box = forwardRef<HTMLDivElement, { type: NotifyType, text: string, onClose?: () => void }>(({ type, text, onClose }, ref) => {
    return <div className={style.box} ref={ref}>
        <img src={type === 'Success' ? successIco : errorIco} />
        <span>{text}</span>
        <IconButton icon={clsoeSvg} className={[style.close_btn]} onClick={onClose} />
    </div>
});