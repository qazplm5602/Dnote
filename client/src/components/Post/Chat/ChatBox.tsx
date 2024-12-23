import style from '../post.module.css';

import { IconButton } from '../../Recycle/Button';
import NameTag from '../../NameTag/NameTag';
import IconText from '../../Recycle/IconText';

import replySvg from '../../../assets/icons/reply.svg';
import goodSvg from '../../../assets/icons/good.svg';
import otherSvg from '../../../assets/icons/other.svg'
import { UserDTO } from '../../LoginState/LoginState';
import { dateFormatNumber, numberWithCommas } from '../../Utils/misc';

export interface ChatBaseDTO {
    owner: UserDTO,
    content: string,
    created: string
}

export interface PostChatDTO extends ChatBaseDTO {
    id: number,
    good: number,
    reply_count: number
}

export default function PostChatBox({ data }: { data: PostChatDTO }) {
    return <div className={style.box}>
        <section className={style.detail}>
            <div className={style.info}>
                <NameTag className={style.nametag} user={data.owner} />
                <div className={style.one}></div>
                <div className={style.date}>{dateFormatNumber(new Date(data.created))}</div>
            </div>

            <IconButton icon={otherSvg} className={[style.other]} />
        </section>

        <div className={style.content}>{data.content}</div>

        <section className={style.interaction}>
            <IconButton icon={replySvg} className={[style.reply]} />
            <button className={style.good}><IconText icon={goodSvg} text={data.good.toString()} /></button>
            <button className={style.reply_open}>답글 {numberWithCommas(data.reply_count)}개</button>
        </section>
    </div>;
}