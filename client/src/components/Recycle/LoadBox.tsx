import style from './loadBox.module.css';

export default function LoadBox({ className, delay }: { className?: string, delay?: number }) {
    return <div className={`${style.load} ${className || ''}`}>
        <div className={style.in} style={{animationDelay: `${delay || 0}ms`}}></div>
    </div>
}