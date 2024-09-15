import IconText from '../Recycle/IconText';
import style from './timetake.module.css';

import TimerIcon from '../../assets/icons/timer.svg';

export default function TimeTake({ className }: { className?: string }) {
    return <IconText className={style.time + ` ${className || ''}`} icon={TimerIcon} text='10분' />
}