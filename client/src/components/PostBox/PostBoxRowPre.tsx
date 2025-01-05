import style from './postboxrow.module.css';
import defaultStyle from './postbox.module.css';
import LoadBox from '../Recycle/LoadBox';

type Props = {
    className: string,
    delay?: number
}
export default function PostBoxRowPre({ className, delay }: Props) {
    return <div className={`${style.item} ${style.pre} ${className || ''}`}>
        <div className={style.detail}>
            <LoadBox className={style.title} delay={delay} />

            <ul className={`${defaultStyle.tags} ${style.tags}`}>
                <LoadBox className={style.tag} delay={delay} />
                <LoadBox className={style.tag} delay={delay} />
            </ul>
        </div>

        <LoadBox className={style.thumbnail} delay={delay} />
    </div>;
}