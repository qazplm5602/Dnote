// import style from './userContents.module.scss';

import Footer from '../Footer/Footer';
import Pagenation from '../Recycle/Pagenation/Pagenation';
import Header from './Header';
import PostList from './PostList/PostList';

export default function UserContents() {
    return <main>
        <Header />
        <PostList data={null} className={'screen_container'} />
        <Pagenation total={-1} page={1} />

        <Footer />
    </main>;
}