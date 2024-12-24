import { useEffect } from "react";
import { aliveType, numberWithCommas } from "../../Utils/misc"
import { useParams } from "react-router-dom";
import request from "../../Utils/request";

type ComponentProps = {
    value: number | null,
    setValue: React.Dispatch<React.SetStateAction<number | null>>
}

export default function ChatTitle({ value, setValue }: ComponentProps) {
    const { id, user } = useParams();
    
    const onLoadCount = async function(data: aliveType) {
        const response = await request<number>(`post/${user}/${id}/chat/count`);
        
        if (data.alive)
            setValue(response.data);
    }

    useEffect(() => {
        const aliveRef: aliveType = { alive: true };

        setValue(null);
        onLoadCount(aliveRef);

        return () => {
            aliveRef.alive = false;
        }
    }, [ id, user ]);

    return <h2>댓글 <span>{numberWithCommas(value || 0)}</span></h2>;
}