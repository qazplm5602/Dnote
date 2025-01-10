import style from './write.module.css';

import landscapeIcon from '../../assets/icons/media-landscape-fill.svg';
import editIcon from '../../assets/icons/ic-round-create.svg';
import LoadBox from '../Recycle/LoadBox';
import { useRef, useState } from 'react';
import { useNotify } from '../Notify/NotifyContext';
import request, { ErrorResponse } from '../Utils/request';
import { AxiosError } from 'axios';

type Props = {
    value: string | null,
    setValue: React.Dispatch<React.SetStateAction<string | null>>    
}

interface BoxProps {
    onEdit?: () => void
}

interface BoxProps2 extends BoxProps {
    image: string
}

export default function WriteThumbnailBox({ value, setValue }: Props) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [ loading, setLoading ] = useState(false);
    const notify = useNotify();
    
    const onEdit = function() {
        if (fileRef.current === null) return;
        fileRef.current.click();
    }

    const onChangeFile = async function(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.item(0);
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            notify('Error', "이미지만 가능합니다.", 5000);
            return;
        }

        setLoading(true);

        const form = new FormData();
        form.append("domi", file);

        const response = await request<string>("post/attachment/upload", { method: "POST", data: form }).catch(e => e as AxiosError<ErrorResponse>);
        setLoading(false);

        if (response instanceof AxiosError) {
            notify('Error', "사진을 업로드할 수 없습니다. 나중에 다시 시도하세요.", 5000);
            return;
        }

        setValue(response.data);
    }

    return <article className={`screen_container ${style.thumbnail_main}`}>
        {loading && <LoadingBox />}
        {!loading && value && <ImageBox onEdit={onEdit} image={value} />}
        {!loading && !value && <ImageEmptyBox onEdit={onEdit} />}
        <input type="file" ref={fileRef} className={style.file_selector} onChange={onChangeFile} />
    </article>
}

function ImageEmptyBox({ onEdit }: BoxProps) {
    return <div className={`${style.box} ${style.empty}`} onClick={onEdit}>
        <img src={landscapeIcon} />
        <p>썸네일을 변경하려면 클릭하세요.</p>
    </div>;
}

function ImageBox({ onEdit, image }: BoxProps2) {
    return <div className={style.box} onClick={onEdit}>
        <img src={`file/attachment/${image}`} className={style.bg} />

        {/* edit 박스 */}
        <div className={style.edit}>
            <img src={editIcon} />
        </div>
    </div>
}

function LoadingBox() {
    return <div className={style.box}>
        <LoadBox className={style.pre} />
    </div>;
}