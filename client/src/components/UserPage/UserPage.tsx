import Footer from '../Footer/Footer';
import style from './userpage.module.css';

import Avater from '../../assets/image0.jpg';
import IconText from '../Recycle/IconText';
import HeartIcon from '../../assets/icons/heart.svg';
import { Link } from 'react-router-dom';

import GithubIcon from '../../assets/icons/github.svg';
import EmailIcon from '../../assets/icons/email.svg';
import HeadMenuList from '../Recycle/HeadMenuList/HeadMenuList';
import PostBox from '../PostBox/PostBox';

export default function UserPage() {
    return <main>
        <Profile />
        <LinkList />
        <PopularContent />
        <LatestConent />
        <Footer />
    </main>;
}

function Profile() {
    return <article className={`${style.profile} screen_container`}>
        <section className={style.left}>
            <img className={style.avater} src={Avater} />
            <div className={style.detail}>
                <div className={style.name}>도미</div>
                <div className={style.info}>여기에는 아무 프로필 소개</div>
            </div>
        </section>

        <section className={style.right}>
            <IconText icon={HeartIcon} text='10' className={style.follow} />
            <button className={style.follow_btn}>팔로우</button>
        </section>
    </article>;
}

function LinkList() {
    return <section className={`screen_container ${style.links}`}>
        <span>Link</span>
        <ul>
            <Link to="https://github.com/qazplm5602"><img src={GithubIcon} /></Link>
            <Link to="https://github.com/qazplm5602"><img src={EmailIcon} /></Link>
        </ul>
    </section>
}

function PopularContent() {
    return <HeadMenuList title='인기있는 콘텐츠' menu='모두 보기' to='/' className={`${style.list} screen_container`}>
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
    </HeadMenuList>
}

function LatestConent() {
    return <HeadMenuList title='최근 콘텐츠' menu='모두 보기' to='/' className={`${style.list} screen_container`}>
        <PostBox />
        <PostBox />
        <PostBox />
        <PostBox />
    </HeadMenuList>
}