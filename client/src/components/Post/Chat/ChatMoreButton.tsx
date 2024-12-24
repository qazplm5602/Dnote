import { SpinnerButton } from '../../Recycle/Button';
import style from '../post.module.css';

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    loading: boolean
}
export function MoreButton({ onClick, loading }: Props) {
    // return <button className={style.more} onClick={onClick}>더보기<SpinnerButton /></button>;
    return <SpinnerButton className={[style.more]} onClick={onClick} loading={loading} spinnerClass={style.spinner}>{loading ? '' : '더보기'}</SpinnerButton>;
}

export function ReplyMoreButton({ onClick }: { onClick: Props['onClick'] }) {
    return <button className={`${style.more_reply} ${style.reply_left}`} onClick={onClick}>더보기</button>;
}