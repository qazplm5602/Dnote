import style from './spinner.module.css';

export default function Spinner({ className }: { className?: string }) {
    return <div className={`${style.loader} ${className || ''}`}></div>;
}