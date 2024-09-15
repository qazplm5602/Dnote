import style from './postbox.module.css';

import ExampleImg from '../../assets/exmaple.png';
import NameTag from '../NameTag/NameTag';
import TimeTake from '../TimeTake/TimeTake';
import { Link } from 'react-router-dom';

export default function PostBox({ className }: { className?: string }) {
    const classList = [style.item];
    if (className)
        classList.push(className);

    return <div className={classList.join(' ')}>
        <Link to={'#'}>
            <img className={style.thumbnail} src={ExampleImg} />
        </Link>
        
        <ul className={style.tags}>
            <div>#mysql</div>
            <div>#react</div>
        </ul>

        <Link to={'#'}>
            <h3>react도 하면서 mysql도 하는 방법 알려드림니다.</h3>
        </Link>
        <Link to={'#'}>
            <div className={style.subtext}>그래서 결론적으로 궁시렁~ 혀야ㅗㄹㅇ녀호ㅕㅇㄹ홍ㄹ허ㅏㄴㅇㄹ혀ㅏㄴㅇ론아ㅓㅣ혼일호닝호</div>
        </Link>

        <div className={style.detail}>
            <Link to={'#'}>
                <NameTag className={style.profile} />
            </Link>
            <div className={style.line}></div>
            <div className={style.date}>2024.08.25</div>
            <div className={style.line}></div>
            <TimeTake />
        </div>
    </div>;
}