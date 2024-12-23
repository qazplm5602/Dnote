import style from '../post.module.css';

import { IconButton } from '../../Recycle/Button';
import NameTag from '../../NameTag/NameTag';
import IconText from '../../Recycle/IconText';

import replySvg from '../../../assets/icons/reply.svg';
import goodSvg from '../../../assets/icons/good.svg';
import otherSvg from '../../../assets/icons/other.svg'


export default function PostChatBox() {
    return <div className={style.box}>
        <section className={style.detail}>
            <div className={style.info}>
                <NameTag className={style.nametag} />
                <div className={style.one}></div>
                <div className={style.date}>2024.09.13</div>
            </div>

            <IconButton icon={otherSvg} className={[style.other]} />
        </section>

        <div className={style.content}>그냥 아무 댓글 임니다.</div>

        <section className={style.interaction}>
            <IconButton icon={replySvg} className={[style.reply]} />
            <button className={style.good}><IconText icon={goodSvg} text='10' /></button>
            <button className={style.reply_open}>답글 3개</button>
        </section>
    </div>;
}