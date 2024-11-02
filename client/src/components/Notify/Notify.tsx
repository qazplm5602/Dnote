import { TransitionGroup } from 'react-transition-group';
import style from './notify.module.css';

import errorIco from '../../assets/icons/error.svg';
import successIco from '../../assets/icons/success.svg';
import clsoeSvg from '../../assets/icons/ic-close-solid.svg';
import { IconButton } from '../Recycle/Button';

export type NotifyType = 'Error' | 'Success';

export default function Notify() {
    return <section className={style.main}>
        <Box />
    </section>
}

function Box() {
    return <div className={style.box}>
        <img src={errorIco} />
        <span>오류가 발생하였습니다.</span>
        <IconButton icon={clsoeSvg} className={[style.close_btn]} />
    </div>
}