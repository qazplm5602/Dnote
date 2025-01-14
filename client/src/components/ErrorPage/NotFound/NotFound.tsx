import { useNavigate } from 'react-router-dom';
import Button from '../../Recycle/Button';
import style from './notFound.module.scss';
import MetaTag from '../../MetaTag/MetaTag';

export default function NotFoundPage() {
    const navigate = useNavigate();
    
    const goHome = function() {
        navigate("/");
    }

    return <main className={style.main}>
        <MetaTag title='Not Found' />

        <h1 className={style.code}>4<span>0</span>4</h1>
        <h2 className={style.title}>페이지를 찾을 수 없습니다.</h2>
        <span className={style.subtitle}>페이지가 존재하지 않거나 삭제된 페이지 입니다.<br></br>입력하신 주소가 정확한지 확인해주세요.</span>
    
        <Button onClick={goHome}>돌아가기</Button>
    </main>;
}