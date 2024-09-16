export default function Input({ className, type, placeholder }: { className?: string, type: React.HTMLInputTypeAttribute, placeholder?: string }) {
    // 나중에 state 넣을 예정
    
    return <input className={className} type={type} placeholder={placeholder} />
}