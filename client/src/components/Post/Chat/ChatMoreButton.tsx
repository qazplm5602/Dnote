import style from '../post.module.css';

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}
export function MoreButton({ onClick }: Props) {
    return <button className={style.more} onClick={onClick}>더보기</button>;
}

export function ReplyMoreButton() {
    return <button className={style.more_reply}>더보기</button>;
}