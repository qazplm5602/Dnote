import Footer from "../Footer/Footer";
import Pagenation from "../Recycle/Pagenation/Pagenation";
import { useSearchOption } from "../Search/SearchHooks";
import PostList from "../UserContents/PostList/PostList";
import PostLatestHead from "./Head";

export default function PostLatest() {
    const { page } = useSearchOption();
    

    return <main>
        <PostLatestHead />
        <PostList className="screen_container" data={null} />
        <Pagenation total={0} page={Number(page)} />

        <Footer />
    </main>
}