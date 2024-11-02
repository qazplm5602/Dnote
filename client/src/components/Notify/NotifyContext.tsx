import { createContext, useContext, useRef } from "react";
import Notify, { NotifyType } from "./Notify";

export type ContextType = {
    post: (( type: NotifyType, text: string, time: number ) => void) | null
};

const context = createContext<ContextType>({ post: null });

export default function NotifyContext({ children }: { children?: React.ReactNode }) {
    const ref = useRef<ContextType['post']>(null);
    const sendPost = function(type: NotifyType, text: string, time: number) {
        if (ref.current === null)
            throw new Error("Notify Callback이 등록되지 않았습니다.");

        ref.current(type, text, time);
    }

    return <context.Provider value={{ post: sendPost }}>
        {children}
        <Notify callback={ref} />
    </context.Provider>;
}

export function useNotify() {
    const value = useContext(context);
    if (value.post === null)
        throw new Error("Notify가 준비되지 않았습니다.");

    return value.post;
}