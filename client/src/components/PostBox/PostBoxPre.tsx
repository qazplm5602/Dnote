import LoadBox from '../Recycle/LoadBox';
import style from './postbox.module.css';

export default function PostBoxPre({ className, delay }: { className?: string, delay?: number }) {
    const classList = [style.item, style.preload];
    if (className)
        classList.push(className);

    return <div className={classList.join(' ')}>
        <a>
            <LoadBox delay={delay} className={style.thumbnail} />
        </a>

        <LoadBox delay={delay} className={style.title} />

        <LoadBox delay={delay} className={style.subtext} />
        <LoadBox delay={delay} className={style.subtext} />
    </div>;
}