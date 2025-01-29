import { Link } from 'react-router-dom';
import defaultStyle from './postbox.module.css';
import style from './postboxrow.module.css';

import { PostDTO } from '../Post/Post';
import { getThumbnailUrl } from './PostBox';

export default function PostBoxRow({ className, post }: { className?: string, post: PostDTO }) {
    const classList = [defaultStyle.item, style.item];
    const url = `/post/${post.owner.id}/${post.id}`;

    if (className) {
        classList.push(className);
    }

    return <div className={classList.join(' ')}>
        <div className={style.detail}>
            <Link to={url}>
                <h3>{post.title}</h3>
            </Link>
            <ul className={`${defaultStyle.tags} ${style.tags}`}>
                <section>
                    {post.tags.map(v => <div key={v}>#{v}</div>)}
                </section>
            </ul>
        </div>

        <Link to={url}>
            <img className={`${defaultStyle.thumbnail} ${style.thumbnail}`} src={getThumbnailUrl(post.thumbnail)} />
        </Link>
    </div>;
}