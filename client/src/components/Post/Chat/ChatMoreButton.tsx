import style from '../post.module.css';

export function MoreButton() {
    return <button className={style.more}>더보기</button>;
}

export function ReplyMoreButton() {
    return <button className={style.more_reply}>더보기</button>;
}