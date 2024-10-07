import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

import IconText from '../Recycle/IconText';
import style from './post.module.css';

import NameTag from '../NameTag/NameTag';
import TimeTake from '../TimeTake/TimeTake';
import Button, { IconButton } from '../Recycle/Button';

import eyeSvg from '../../assets/icons/eyes.svg';
import goodSvg from '../../assets/icons/good.svg';
import shareSvg from '../../assets/icons/share.svg';
import replySvg from '../../assets/icons/reply.svg';
import Footer from '../Footer/Footer';

export default function Post() {
    return <>
        <main className={`screen_container ${style.main}`}>
            <Content />
            <PopularList />
        </main>
        <Footer />
    </>;
}

function Content() {
    return <article className={style.content}>
        <h2 className={style.title}>AWS를 이용해서 사이트를 배포 해보자ㅏㅏㅏ</h2>
        <Tags />
        <Detail />
        
        <ViewerContainer />

        <Interactions />
        <Chat />
    </article>;
}

function Tags() {
    return <section className={style.tags}>
        <div>#aws</div>
        <div>#s3</div>
        <div>#ec2</div>
    </section>;
}

function Detail() {
    return <section className={style.detail}>
        <div className={style.left}>
            <NameTag />
            <p>
                <div className={style.date}>2024.08.25</div>
                <div className={style.line}></div>
                <TimeTake />
            </p>
        </div>

        <IconText className={style.view} icon={eyeSvg} text='1.2천명' />
    </section>;
}

function ViewerContainer() {
    return <Viewer
        initialValue={["![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)", "", "# Awesome Editor!", "", "It has been _released as opensource in 2018_ and has ~~continually~~ evolved to **receive 10k GitHub ⭐️ Stars**.", "", "## Create Instance", "", "You can create an instance with the following code and use `getHtml()` and `getMarkdown()` of the [Editor](https://github.com/nhn/tui.editor).", "", "```js", "const editor = new Editor(options);", "```", "", "> See the table below for default options", "> > More API information can be found in the document", "", "| name | type | description |", "| --- | --- | --- |", "| el | `HTMLElement` | container element |", "", "## Features", "", "* CommonMark + GFM Specifications", "   * Live Preview", "   * Scroll Sync", "   * Auto Indent", "   * Syntax Highlight", "        1. Markdown", "        2. Preview", "", "## Support Wrappers", "", "> * Wrappers", ">    1. [x] React", ">    2. [x] Vue", ">    3. [ ] Ember"].join("\n")}
    />;
}

function Chat() {
    return <section className={style.chat_main}>
        <h2>댓글 <span>20</span></h2>
        <ChatInput />

        <ChatList />
    </section>;
}

function ChatInput() {
    return <article className={style.input_container}>
        <textarea placeholder='내용을 입력하세요.'></textarea>
        <Button>전송</Button>
    </article>;
}

function ChatList() {
    return <article className={style.list}>
        <ChatBox />
        <ChatBox />
    </article>;
}

function ChatBox() {
    return <div className={style.box}>
        <section className={style.detail}>
            <div className={style.info}>
                <NameTag className={style.nametag} />
                <div className={style.one}></div>
                <div className={style.date}>2024.09.13</div>
            </div>
        </section>

        <div className={style.content}>그냥 아무 댓글 임니다.</div>

        <section className={style.interaction}>
            <IconButton icon={replySvg} className={[style.reply]} />
            <button className={style.good}><IconText icon={goodSvg} text='10' /></button>
            <button className={style.reply_open}>답글 3개</button>
        </section>
    </div>;
}

function Interactions() {
    return <section className={style.interaction}>
        <button className={style.good}><IconText icon={goodSvg} text='20' /></button>
        <IconButton className={[style.share]} icon={shareSvg} />
    </section>;
}

function PopularList() {
    return <article className={style.popular}>
        <h2>인기있는 콘텐츠</h2>
    </article>;
}