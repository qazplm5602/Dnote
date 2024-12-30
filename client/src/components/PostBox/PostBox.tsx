import style from './postbox.module.css';

import ExampleImg from '../../assets/exmaple.png';
import NameTag from '../NameTag/NameTag';
import TimeTake from '../TimeTake/TimeTake';
import { Link } from 'react-router-dom';
import { PostDTO } from '../Post/Post';
import { dateFormatNumber } from '../Utils/misc';

const testPostInit: PostDTO = {
    id: 10,
    content: "그래서 결론적으로 궁시렁~ 혀야ㅗㄹㅇ녀호ㅕㅇㄹ홍ㄹ허ㅏㄴㅇㄹ혀ㅏㄴㅇ론아ㅓㅣ혼일호닝호",
    created: "Mon Dec 30 2024 12:47:18 GMT+0900",
    owner: {
        avatar: null,
        id: 1,
        name: "더미"
    },
    read: 0,
    tags: [ "react", "mysql", "web" ],
    thumbnail: "",
    title: "react도 하면서 mysql도 하는 방법 알려드림니다.",
    view: 10
}

export default function PostBox({ className, post = testPostInit }: { className?: string, post?: PostDTO }) {
    const classList = [style.item];
    const postUrl = `/post/${post.owner.id}/${post.id}`;

    if (className)
        classList.push(className);

    return <div className={classList.join(' ')}>
        <Link to={postUrl}>
            <img className={style.thumbnail} src={ExampleImg} />
        </Link>
        
        <ul className={style.tags}>
            {post.tags.map(v => <div key={v}>#{v}</div>)}
        </ul>

        <Link to={postUrl}>
            <h3>{post.title}</h3>
        </Link>
        <Link to={postUrl}>
            <div className={style.subtext}>{post.content}</div>
        </Link>

        <div className={style.detail}>
            <NameTag className={style.profile} user={post.owner} />
            <div className={style.line}></div>
            <div className={style.date}>{dateFormatNumber(new Date(post.created))}</div>
            <div className={style.line}></div>
            <TimeTake time={post.read} />
        </div>
    </div>;
}