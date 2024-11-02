import { TransitionGroup, CSSTransition } from 'react-transition-group';
import style from './notify.module.css';

import errorIco from '../../assets/icons/error.svg';
import successIco from '../../assets/icons/success.svg';
import clsoeSvg from '../../assets/icons/ic-close-solid.svg';
import { IconButton } from '../Recycle/Button';
import { createRef, forwardRef, useEffect, useRef, useState } from 'react';
import { randomString } from '../Utils/misc';
import { ContextType } from './NotifyContext';

export type NotifyType = 'Error' | 'Success';
interface NotifyData {
    id: string,
    type: NotifyType,
    text: string,
    nodeRef: React.RefObject<HTMLDivElement>,
    time: Date,
    timer: NodeJS.Timeout | null
}

export default function Notify({ callback }: { callback: React.MutableRefObject<ContextType['post']> }) {
    const [ list, setList ] = useState<NotifyData[]>([]);
    const listRef = useRef<NotifyData[]>([]);

    const onRemove = function(id: string) {
        setList(prev => {
            let idx = -1;
            
            prev.forEach((v, i) => {
                if (v.id === id) {
                    idx = i;

                    // 타이머 끝 ---
                    if (v.timer !== null)
                        clearTimeout(v.timer);

                    return false;
                }
            });

            if (idx === -1) {
                return prev;
            }

            prev.splice(idx, 1);

            return [ ...prev ];
        });
    }

    const onCreate = function(type: NotifyType, text: string, time: number) {
        const id = randomString(5);
        const timeHandler = setTimeout(() => {
            onRemove(id);
        }, time);
        
        const data: NotifyData = {
            id,
            type,
            nodeRef: createRef(),
            text,
            time: new Date( Date.now() + time ),
            timer: timeHandler
        }

        setList((prev) => {
            return [...prev, data];
        });
    }
    
    useEffect(() =>  {
        listRef.current = list;
    }, [list]);

    useEffect(() => {
        callback.current = onCreate;

        return () => {
            callback.current = null;

            // 타이머 제거
            console.log("timer clear!");
            listRef.current.forEach(v => {
                if (v.timer)
                    clearTimeout(v.timer);
            });
        }
    }, []);

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
                <Box type={v.type} text={v.text} ref={v.nodeRef} onClose={() => onRemove(v.id)} />
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