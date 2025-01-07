import style from './write.module.css';

import landscapeIcon from '../../assets/icons/media-landscape-fill.svg';
import exampleImage from '../../assets/exmaple.png';
import editIcon from '../../assets/icons/ic-round-create.svg';

export default function WriteThumbnailBox() {
    return <article className={`screen_container ${style.thumbnail_main}`}>
        <ImageEmptyBox />
        {/* <ImageBox /> */}
    </article>
}

function ImageEmptyBox() {
    return <div className={`${style.box} ${style.empty}`}>
        <img src={landscapeIcon} />
        <p>썸네일을 변경하려면 클릭하세요.</p>
    </div>;
}

function ImageBox() {
    return <div className={style.box}>
        <img src={exampleImage} className={style.bg} />

        {/* edit 박스 */}
        <div className={style.edit}>
            <img src={editIcon} />
        </div>
    </div>
}