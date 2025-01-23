import Spinner from '../../Recycle/Spinner';
import style from '../settingGeneric.module.css';

export default function SettingLoading() {
    return <article className={style.main}>
        <Spinner className={style.spinner} />
    </article>;
}