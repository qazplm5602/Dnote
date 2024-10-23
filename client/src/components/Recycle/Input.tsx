export default function Input({ className, type, placeholder, onChange, onFocus, onBlur, ...props }: { className?: string, type: React.HTMLInputTypeAttribute, placeholder?: string, onChange?: React.ChangeEventHandler<HTMLInputElement>, onFocus?: React.FocusEventHandler<HTMLInputElement>, onBlur?: React.FocusEventHandler<HTMLInputElement> }) {
    // 나중에 state 넣을 예정
    
    return <input className={className} type={type} placeholder={placeholder} onChange={onChange} onFocus={onFocus} onBlur={onBlur} {...props} />
}