import { Link } from 'react-router-dom';
import defaultStyle from './postbox.module.css';
import style from './postboxrow.module.css';

import ExampleImg from '../../assets/exmaple.png';

export default function PostBoxRow({ className }: { className?: string }) {
    const classList = [defaultStyle.item, style.item];

    if (className) {
        classList.push(className);
    }

    return <div className={classList.join(' ')}>
        <div className={style.detail}>
            <Link to={'#'}>
                <h3>react도 하면서 mysql도 하는 방법 알려드림니다.</h3>
            </Link>
            <ul className={`${defaultStyle.tags} ${style.tags}`}>
                <div>#mysql</div>
                <div>#react</div>
            </ul>
        </div>

        <Link to={'#'}>
            <img className={`${defaultStyle.thumbnail} ${style.thumbnail}`} src={ExampleImg} />
        </Link>
    </div>;
}