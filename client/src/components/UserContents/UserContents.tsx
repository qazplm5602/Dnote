// import style from './userContents.module.scss';

import Footer from '../Footer/Footer';
import Header from './Header';
import PostList from './PostList/PostList';

export default function UserContents() {
    return <main>
        <Header />
        <PostList data={null} className={'screen_container'} />

        <Footer />
    </main>;
}